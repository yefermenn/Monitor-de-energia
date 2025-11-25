import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type as TransformType } from 'class-transformer';

export class CreateUsuarioMedidorDto {
  
  @IsString()
  @Length(1, 100)
  codigo: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombrePersonalizado?: string;

  // opcional: si el medidor no existe, permitir crearlo con una cantidad de sensores
  @IsOptional()
  @IsInt()
  @Min(1)
  cantidadSensores?: number;
}

export class CreateUsuarioDto {

    
  @IsString()
  @Length(1, 255)
  nombre: string;

  @IsString()
  @Length(1, 255)
  correo: string;

  // La entidad usa la propiedad `contraseA` (por el nombre de la columna `contraseña`),
  // así que mantenemos la misma propiedad para mapear correctamente.
  @IsString()
  @Length(1, 255)
  contraseA: string;

  @IsOptional()
  @TransformType(() => Date)
  fechaCreacion?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @TransformType(() => CreateUsuarioMedidorDto)
  medidores?: CreateUsuarioMedidorDto[];
}
