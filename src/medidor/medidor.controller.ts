import { Body, Controller, Post } from '@nestjs/common';
import { MedidoresService } from './medidor.service';
import { CreateMedidorDto } from './dto/create-medidor.dto';
import { Medidores } from '../database/entities/entities/Medidores';

@Controller('medidor')
export class MedidorController {
    constructor(private readonly medidoresService: MedidoresService) {}

  @Post()
  async crear(@Body() createMedidorDto: CreateMedidorDto): Promise<Medidores> {
    return this.medidoresService.crear(createMedidorDto);
  }
}
