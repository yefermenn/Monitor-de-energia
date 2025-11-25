import { IsOptional, IsString, Length } from 'class-validator';

export class LoginUsuarioDto {
  @IsString()
  @Length(1, 255)
  correo: string;

  @IsString()
  @Length(1, 255)
  contraseA: string;
}
