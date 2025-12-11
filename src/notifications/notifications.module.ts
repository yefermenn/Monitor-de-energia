import { Module } from '@nestjs/common';
import { MedidasGateway } from './medidas.gateway';
import { MedidasListenerService } from './medidas.listener.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [MedidasGateway, MedidasListenerService],
  exports: [MedidasGateway],
})
export class NotificationsModule {}
