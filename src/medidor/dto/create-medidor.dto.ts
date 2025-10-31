import { IsString, IsInt, Min, Length } from 'class-validator';

export class CreateMedidorDto {
  @IsString()
  @Length(1, 100)
  codigo: string;

  @IsInt()
  @Min(1)
  cantidadSensores: number;
}
