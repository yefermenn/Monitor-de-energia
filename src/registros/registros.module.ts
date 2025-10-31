import { Module } from '@nestjs/common';
import { RegistrosService } from './registros.service';
import { RegistrosController } from './registros.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrosMedidas } from 'src/database/entities/entities/RegistrosMedidas';
import { Medidores } from 'src/database/entities/entities/Medidores';

@Module({
  imports:[TypeOrmModule.forFeature([RegistrosMedidas]),
            TypeOrmModule.forFeature([Medidores])],
  providers: [RegistrosService],
  controllers: [RegistrosController]
})
export class RegistrosModule {}
