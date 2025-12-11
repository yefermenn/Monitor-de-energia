import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { RegistrosModule } from './registros/registros.module';
import { MedidorModule } from './medidor/medidor.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({
      isGlobal: true, // disponible en toda la app
    }),

    // Conexión con PostgreSQL
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,

        // Ruta a las entidades generadas
        entities: [join(__dirname, '**', '*.{ts,js}')],

        // NO sincronizar para evitar modificar tu BD
        synchronize: true,
        autoLoadEntities: true,
        logging: true, // opcional para depuración
      }),
    }),

    RegistrosModule,

    MedidorModule,
    UsuariosModule,
    // Módulo que escucha NOTIFY y emite por WebSocket
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
