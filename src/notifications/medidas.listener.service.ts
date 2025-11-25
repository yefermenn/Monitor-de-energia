import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { DataSource } from 'typeorm';
import { MedidasGateway } from './medidas.gateway';

@Injectable()
export class MedidasListenerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MedidasListenerService.name);
  private client: Client | null = null;

  constructor(private dataSource: DataSource, private gateway: MedidasGateway) {}

  async onModuleInit() {
    const config = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

    this.client = new Client(config);

    try {
      await this.client.connect();
      this.logger.log('Conectado a Postgres para LISTEN/NOTIFY');
      await this.client.query('LISTEN nueva_medida');

      this.client.on('notification', async (msg) => {
        try {
          this.logger.log(`Notificación recibida: ${msg.channel} payload=${msg.payload}`);

          // Obtener el último registro insertado en registros_medidas
          const rows = await this.dataSource.query(
            `SELECT rm.*, rm.medidor_codigo as medidor_codigo FROM registros_medidas rm ORDER BY id DESC LIMIT 1`,
          );

          const payload = {
            notifyPayload: msg.payload,
            registro: rows[0] ?? null,
          };

          this.gateway.notifyNewMedida(payload);
        } catch (err) {
          this.logger.error('Error manejando notification', err as any);
        }
      });
    } catch (err) {
      this.logger.error('No se pudo conectar al listener de Postgres', err as any);
      // dejar client null para evitar cerrar no conectado
      this.client = null;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.query('UNLISTEN nueva_medida');
        await this.client.end();
        this.logger.log('Desconectado del listener de Postgres');
      } catch (err) {
        this.logger.error('Error al desconectar client pg', err as any);
      }
    }
  }
}
