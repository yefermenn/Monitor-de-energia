import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Usuarios } from '../database/entities/entities/Usuarios';
import { Medidores } from '../database/entities/entities/Medidores';
import { UsuarioMedidor } from '../database/entities/entities/UsuarioMedidor';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { CreateUsuarioMedidorDto } from './dto/create-usuario-medidor.dto';

@Injectable()
export class UsuariosService {
	constructor(
		private dataSource: DataSource,
		@InjectRepository(Usuarios)
		private usuariosRepo: Repository<Usuarios>,
		@InjectRepository(Medidores)
		private medidoresRepo: Repository<Medidores>,
		@InjectRepository(UsuarioMedidor)
		private usuarioMedidorRepo: Repository<UsuarioMedidor>,
	) {}

	/**
	 * Crea un usuario y le asigna medidores.
	 * - Si un medidor no existe, se crea (si viene cantidadSensores en el DTO).
	 * - Se crean las filas en usuario_medidor para la relación.
	 */
	async crearConMedidores(dto: CreateUsuarioDto) {
		return await this.dataSource.transaction(async (manager) => {
			// crear usuario
			const usuario = this.usuariosRepo.create({
				nombre: dto.nombre,
				correo: dto.correo,
				contraseA: dto.contraseA,
				fechaCreacion: dto.fechaCreacion ?? null,
			});

			const usuarioGuardado = await manager.save(Usuarios, usuario);

			// si no hay medidores, devolvemos el usuario
			if (!dto.medidores || dto.medidores.length === 0) {
				return usuarioGuardado;
			}

			const asignaciones: UsuarioMedidor[] = [];

			for (const m of dto.medidores) {
				let medidor = await manager.findOne(Medidores, {
					where: { codigo: m.codigo },
				});

				if (!medidor) {
					// crear medidor si viene la cantidad de sensores
					medidor = manager.create(Medidores, {
						codigo: m.codigo,
						cantidadSensores: m.cantidadSensores ?? 1,
					});
					medidor = await manager.save(Medidores, medidor);
				}

				// crear asignación usuario_medidor
				const asign = manager.create(UsuarioMedidor, {
					usuarioId: usuarioGuardado.id,
					medidorCodigo: medidor.codigo,
					nombrePersonalizado: m.nombrePersonalizado ?? medidor.codigo,
				});

				const asignGuardada = await manager.save(UsuarioMedidor, asign);
				asignaciones.push(asignGuardada);
			}

			// devolver usuario con las asignaciones (no es una entidad completa con relations cargadas)
			return { usuario: usuarioGuardado, medidoresAsignados: asignaciones };
		});
	}

	/**
	 * Busca un usuario por `correo` o por `contraseA` y devuelve
	 * su información junto con todos los medidores asignados.
	 */
	async login(dto: LoginUsuarioDto) {
		const { correo, contraseA } = dto;
		if (!correo && !contraseA) {
			throw new HttpException(
				'Proporciona `correo` o `contraseA` para buscar',
				HttpStatus.BAD_REQUEST,
			);
		}

		const qb = this.usuariosRepo.createQueryBuilder('u')
			.leftJoinAndSelect('u.usuarioMedidors', 'um')
			.leftJoinAndSelect('um.medidorCodigo2', 'm');

		if (correo && contraseA) {
			qb.where('u.correo = :correo AND u.contraseA = :contraseA', { correo, contraseA });
		} else if (correo) {
			qb.where('u.correo = :correo', { correo });
		} else {
			qb.where('u.contraseA = :contraseA', { contraseA });
		}

		const usuario = await qb.getOne();

		if (!usuario) {
			throw new HttpException('Usuario o contraseña incorrectos', HttpStatus.NOT_FOUND);
		}

		return usuario;
	}

	/**
	 * Crea una asignación UsuarioMedidor.
	 * Valida que el usuario y el medidor existan antes de crearla.
	 */
	async crearUsuarioMedidor(dto: CreateUsuarioMedidorDto) {
		// validar existencia de usuario
		const usuario = await this.usuariosRepo.findOne({ where: { id: dto.usuarioId } });
		if (!usuario) {
			throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
		}

		// validar existencia de medidor
		const medidor = await this.medidoresRepo.findOne({ where: { codigo: dto.medidorCodigo } });
		if (!medidor) {
			throw new HttpException('Medidor no encontrado', HttpStatus.NOT_FOUND);
		}

		const asign = this.usuarioMedidorRepo.create({
			usuarioId: dto.usuarioId,
			medidorCodigo: dto.medidorCodigo,
			nombrePersonalizado: dto.nombrePersonalizado ?? dto.medidorCodigo,
		});

		try {
			const guardada = await this.usuarioMedidorRepo.save(asign);
			return guardada;
		} catch (err: any) {
			// manejar duplicados por constraints unique
			if (err && err.code === '23505') {
				throw new HttpException('Asignación ya existe', HttpStatus.CONFLICT);
			}
			throw new HttpException('Error al crear asignación', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
