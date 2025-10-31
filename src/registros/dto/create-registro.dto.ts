import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateRegistroMedidaDto {
  @IsInt()
  @IsPositive()
  numeroSensor: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  valorWatios: number;

  @IsOptional()
  @Type(() => Date)
  timestamp?: Date;

  @IsString()
  @Length(1, 100)
  medidorCodigo: string;
}
