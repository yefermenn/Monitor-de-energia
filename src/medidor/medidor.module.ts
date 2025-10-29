import { Module } from '@nestjs/common';
import { MedidoresService } from './medidor.service';
import { MedidorController } from './medidor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medidores } from 'src/database/entities/entities/Medidores';

@Module({
  imports: [TypeOrmModule.forFeature([Medidores])],
  providers: [MedidoresService],
  controllers: [MedidorController]
})
export class MedidorModule {}
