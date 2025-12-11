import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MedidasGateway {
  @WebSocketServer()
  server: Server;

  notifyNewMedida(payload: any) {
    // Emitir a todos los clientes conectados
    this.server.emit('nueva_medida', payload);
  }
}
