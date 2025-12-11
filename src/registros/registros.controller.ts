import { Body, Controller, Post, Get } from '@nestjs/common';
import { RegistrosService } from './registros.service';
import { CreateRegistroMedidaDto } from './dto/create-registro.dto';
import { RegistrosMedidas } from 'src/database/entities/entities/RegistrosMedidas';

@Controller('registros')
export class RegistrosController {
    constructor(private registrosService: RegistrosService){}

    @Post()
      async crear(@Body() createRegistroMedidaDto:CreateRegistroMedidaDto): Promise<RegistrosMedidas> {
        console.log("registro llegada: ",createRegistroMedidaDto)
        return this.registrosService.crear(createRegistroMedidaDto);
      }

    @Get('prom/dia')
    async obtenerPromedioUltimas24Horas() {
      return this.registrosService.obtenerPromedioUltimas24Horas();
    }

    @Get('prom/sem')
    async obtenerPromedioUltimos7Dias() {
      return this.registrosService.obtenerPromedioUltimos7Dias();
    }

    @Get('prom/mes')
    async obtenerPromedioUltimoMes() {
      return this.registrosService.obtenerPromedioUltimoMes();
    }

    @Get('prom/ano')
    async obtenerPromedioUltimoAno() {
      return this.registrosService.obtenerPromedioUltimoAno();
    }
    
    @Get('prom/dia/diarios')
    async obtenerPromediosDiariosUltimos7Dias() {
      return this.registrosService.obtenerPromediosDiariosUltimos7Dias();
    }

    @Get('prom/sem/semanales')
    async obtenerPromediosSemananalesUltimas4Semanas() {
      return this.registrosService.obtenerPromediosSemananalesUltimas4Semanas();
    }

    @Get('prom/mes/mensuales')
    async obtenerPromediosMensualesHistorico() {
      return this.registrosService.obtenerPromediosMensualesHistorico();
    }
}