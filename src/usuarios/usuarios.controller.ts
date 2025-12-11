import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/login-usuario.dto';
import { CreateUsuarioMedidorDto } from './dto/create-usuario-medidor.dto';

@Controller('usuarios')
export class UsuariosController {
	constructor(private readonly usuariosService: UsuariosService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async crearUsuarioConMedidores(@Body() createUsuarioDto: CreateUsuarioDto) {
		const resultado = await this.usuariosService.crearConMedidores(
			createUsuarioDto,
		);
		return resultado;
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginUsuarioDto) {
		const usuario = await this.usuariosService.login(loginDto);
		return usuario;
	}

	@Post('medidor')
	@HttpCode(HttpStatus.CREATED)
	async crearUsuarioMedidor(@Body() dto: CreateUsuarioMedidorDto) {
		const asign = await this.usuariosService.crearUsuarioMedidor(dto);
		return asign;
	}
}
