import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medidores } from '../database/entities/entities/Medidores';
import { CreateMedidorDto } from './dto/create-medidor.dto';

@Injectable()
export class MedidoresService {
  constructor(
    @InjectRepository(Medidores)
    private medidorRepository: Repository<Medidores>,
  ) {}

  async crear(createMedidorDto: CreateMedidorDto): Promise<Medidores> {
    const nuevo = this.medidorRepository.create(createMedidorDto);
    return await this.medidorRepository.save(nuevo);
  }
}
