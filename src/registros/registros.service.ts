import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrosMedidas } from 'src/database/entities/entities/RegistrosMedidas';
import { Repository } from 'typeorm';
import { CreateRegistroMedidaDto } from './dto/create-registro.dto';
import { Medidores } from 'src/database/entities/entities/Medidores';

@Injectable()
export class RegistrosService {
    constructor(
    @InjectRepository(RegistrosMedidas)
    private readonly registrosRepo: Repository<RegistrosMedidas>,

    @InjectRepository(Medidores)
    private readonly medidoresRepo: Repository<Medidores>,
  ) {}

  async crear(dto: CreateRegistroMedidaDto) {
    // 1️⃣ Buscar el medidor por su código
    const medidor = await this.medidoresRepo.findOne({
      where: { codigo: dto.medidorCodigo },
    });

    if (!medidor) {
      throw new NotFoundException(`No existe un medidor con código ${dto.medidorCodigo}`);
    }

    // 2️⃣ Crear el registro
    const registro = this.registrosRepo.create({
      numeroSensor: dto.numeroSensor,
      valorVatios1: dto.valorVatios1,
      valorVatios2: dto.valorVatios2,
      timestamp: dto.timestamp ?? new Date(),
      medidorCodigo: medidor, // asignar la relación
    });

    // 3️⃣ Guardar
    return await this.registrosRepo.save(registro);
  }

  async obtenerPromedioUltimas24Horas() {
    // Calcular hace 24 horas desde ahora
    const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Realizar la consulta con promedio de los valores
    const resultado = await this.registrosRepo
      .createQueryBuilder('registro')
      .select('AVG(CAST(registro.valorVatios1 AS FLOAT))', 'promedioVatios1')
      .addSelect('AVG(CAST(registro.valorVatios2 AS FLOAT))', 'promedioVatios2')
      .addSelect('COUNT(registro.id)', 'totalRegistros')
      .where('registro.timestamp >= :hace24Horas', { hace24Horas })
      .getRawOne();

    return {
      promedioVatios1: parseFloat(resultado?.promedioVatios1 || 0),
      promedioVatios2: parseFloat(resultado?.promedioVatios2 || 0),
      totalRegistros: parseInt(resultado?.totalRegistros || 0),
      periodo: {
        desde: hace24Horas,
        hasta: new Date(),
      },
    };
  }

  async obtenerPromedioUltimos7Dias() {
    // Calcular hace 7 días desde ahora
    const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Realizar la consulta con promedio de los valores
    const resultado = await this.registrosRepo
      .createQueryBuilder('registro')
      .select('AVG(CAST(registro.valorVatios1 AS FLOAT))', 'promedioVatios1')
      .addSelect('AVG(CAST(registro.valorVatios2 AS FLOAT))', 'promedioVatios2')
      .addSelect('COUNT(registro.id)', 'totalRegistros')
      .where('registro.timestamp >= :hace7Dias', { hace7Dias })
      .getRawOne();

    return {
      promedioVatios1: parseFloat(resultado?.promedioVatios1 || 0),
      promedioVatios2: parseFloat(resultado?.promedioVatios2 || 0),
      totalRegistros: parseInt(resultado?.totalRegistros || 0),
      periodo: {
        desde: hace7Dias,
        hasta: new Date(),
      },
    };
  }

  async obtenerPromediosDiariosUltimos7Dias() {
    // Calcular hace 7 días desde ahora
    const hace7Dias = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Agrupar por día y calcular promedio por cada día
    const resultados = await this.registrosRepo
      .createQueryBuilder('registro')
      .select("DATE_TRUNC('day', registro.timestamp)::date", 'dia')
      .addSelect('AVG(CAST(registro.valorVatios1 AS FLOAT))', 'promedioVatios1')
      .addSelect('AVG(CAST(registro.valorVatios2 AS FLOAT))', 'promedioVatios2')
      .addSelect('COUNT(registro.id)', 'totalRegistros')
      .where('registro.timestamp >= :hace7Dias', { hace7Dias })
      .groupBy('dia')
      .orderBy('dia', 'ASC')
      .getRawMany();

    // Mapear resultados a formato consistente
    return resultados.map((r) => ({
      dia: r.dia ? new Date(r.dia) : null,
      promedioVatios1: parseFloat(r?.promedioVatios1 || 0),
      promedioVatios2: parseFloat(r?.promedioVatios2 || 0),
      totalRegistros: parseInt(r?.totalRegistros ?? r?.totalregistros ?? 0),
    }));
  }

  async obtenerPromediosSemananalesUltimas4Semanas() {
    // Calcular hace 28 días desde ahora (4 semanas)
    const hace28Dias = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

    // Agrupar por semana y calcular promedio por cada semana
    // Usando DATE_TRUNC para PostgreSQL o similar según BD
    const resultados = await this.registrosRepo
      .createQueryBuilder('registro')
      .select("DATE_TRUNC('week', registro.timestamp)::date", 'semana')
      .addSelect('AVG(CAST(registro.valorVatios1 AS FLOAT))', 'promedioVatios1')
      .addSelect('AVG(CAST(registro.valorVatios2 AS FLOAT))', 'promedioVatios2')
      .addSelect('COUNT(registro.id)', 'totalRegistros')
      .where('registro.timestamp >= :hace28Dias', { hace28Dias })
      .groupBy('semana')
      .orderBy('semana', 'ASC')
      .getRawMany();

    // Mapear resultados a formato consistente
    return resultados.map((r) => ({
      semana: r.semana ? new Date(r.semana) : null,
      promedioVatios1: parseFloat(r?.promedioVatios1 || 0),
      promedioVatios2: parseFloat(r?.promedioVatios2 || 0),
      totalRegistros: parseInt(r?.totalRegistros ?? r?.totalregistros ?? 0),
    }));
  }

  async obtenerPromedioUltimoMes() {
    // Calcular hace 30 días desde ahora
    const hace30Dias = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Realizar la consulta con promedio de los valores
    const resultado = await this.registrosRepo
      .createQueryBuilder('registro')
      .select('AVG(CAST(registro.valorVatios1 AS FLOAT))', 'promedioVatios1')
      .addSelect('AVG(CAST(registro.valorVatios2 AS FLOAT))', 'promedioVatios2')
      .addSelect('COUNT(registro.id)', 'totalRegistros')
      .where('registro.timestamp >= :hace30Dias', { hace30Dias })
      .getRawOne();

    return {
      promedioVatios1: parseFloat(resultado?.promedioVatios1 || 0),
      promedioVatios2: parseFloat(resultado?.promedioVatios2 || 0),
      totalRegistros: parseInt(resultado?.totalRegistros || 0),
      periodo: {
        desde: hace30Dias,
        hasta: new Date(),
      },
    };
  }

  async obtenerPromedioUltimoAno() {
    // Calcular hace 365 días desde ahora (último año aproximado)
    const hace365Dias = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    // Realizar la consulta con promedio de los valores
    const resultado = await this.registrosRepo
      .createQueryBuilder('registro')
      .select('AVG(CAST(registro.valorVatios1 AS FLOAT))', 'promedioVatios1')
      .addSelect('AVG(CAST(registro.valorVatios2 AS FLOAT))', 'promedioVatios2')
      .addSelect('COUNT(registro.id)', 'totalRegistros')
      .where('registro.timestamp >= :hace365Dias', { hace365Dias })
      .getRawOne();

    return {
      promedioVatios1: parseFloat(resultado?.promedioVatios1 || 0),
      promedioVatios2: parseFloat(resultado?.promedioVatios2 || 0),
      totalRegistros: parseInt(resultado?.totalRegistros || 0),
      periodo: {
        desde: hace365Dias,
        hasta: new Date(),
      },
    };
  }

  async obtenerPromediosMensualesHistorico() {
    // Agrupar por mes y calcular promedio por cada mes
    const resultados = await this.registrosRepo
      .createQueryBuilder('registro')
      .select("DATE_TRUNC('month', registro.timestamp)::date", 'mes')
      .addSelect('AVG(CAST(registro.valorVatios1 AS FLOAT))', 'promedioVatios1')
      .addSelect('AVG(CAST(registro.valorVatios2 AS FLOAT))', 'promedioVatios2')
      .addSelect('COUNT(registro.id)', 'totalRegistros')
      .groupBy('mes')
      .orderBy('mes', 'ASC')
      .getRawMany();

    // Mapear resultados a formato consistente
    return resultados.map((r) => ({
      mes: r.mes ? new Date(r.mes) : null,
      promedioVatios1: parseFloat(r?.promedioVatios1 || 0),
      promedioVatios2: parseFloat(r?.promedioVatios2 || 0),
      totalRegistros: parseInt(r?.totalRegistros ?? r?.totalregistros ?? 0),
    }));
  }
}
