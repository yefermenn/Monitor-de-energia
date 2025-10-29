import { Body, Controller, Post } from '@nestjs/common';
import { RegistrosService } from './registros.service';
import { CreateRegistroMedidaDto } from './dto/create-registro.dto';
import { RegistrosMedidas } from 'src/database/entities/entities/RegistrosMedidas';

@Controller('registros')
export class RegistrosController {
    constructor(private registrosService: RegistrosService){}

    @Post()
      async crear(@Body() createRegistroMedidaDto:CreateRegistroMedidaDto): Promise<RegistrosMedidas> {
        return this.registrosService.crear(createRegistroMedidaDto);
      }
}
