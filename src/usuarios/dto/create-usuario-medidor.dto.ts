import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateUsuarioMedidorDto {
  @IsInt()
  @Min(1)
  usuarioId: number;

  @IsString()
  @Length(1, 100)
  medidorCodigo: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombrePersonalizado?: string;
}
