import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrosMedidas } from 'src/database/entities/entities/RegistrosMedidas';
import { Repository } from 'typeorm';
import { CreateRegistroMedidaDto } from './dto/create-registro.dto';
import { Medidores } from 'src/database/entities/entities/Medidores';

@Injectable()
export class RegistrosService {
    constructor(
    @InjectRepository(RegistrosMedidas)
    private readonly registrosRepo: Repository<RegistrosMedidas>,

    @InjectRepository(Medidores)
    private readonly medidoresRepo: Repository<Medidores>,
  ) {}

  async crear(dto: CreateRegistroMedidaDto) {
    // 1️⃣ Buscar el medidor por su código
    const medidor = await this.medidoresRepo.findOne({
      where: { codigo: dto.medidorCodigo },
    });

    if (!medidor) {
      throw new NotFoundException(`No existe un medidor con código ${dto.medidorCodigo}`);
    }

    // 2️⃣ Crear el registro
    const registro = this.registrosRepo.create({
      numeroSensor: dto.numeroSensor,
      valorWatios: dto.valorWatios,
      timestamp: dto.timestamp ?? new Date(),
      medidorCodigo: medidor, // asignar la relación
    });

    // 3️⃣ Guardar
    return await this.registrosRepo.save(registro);
  }
}
