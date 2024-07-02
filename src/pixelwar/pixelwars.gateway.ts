import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PixelWarsService } from './pixelwars.service';

@WebSocketGateway({ namespace: 'pixelwars', cors: true })
export class PixelWarsGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(private readonly pixelWarsService: PixelWarsService) {}

  handleConnection(client: any) {
    // Vous pouvez envoyer l'état initial du canvas ici si nécessaire
    client.emit('initialCanvas', this.pixelWarsService.getCanvas());
  }

  @SubscribeMessage('setPseudo')
  handleSetPseudo(
    @MessageBody() pseudo: string,
    @ConnectedSocket() client: Socket,
  ) {
    client['pseudo'] = pseudo;
  }
  @SubscribeMessage('pixelUpdate')
  handlePixelUpdate(
    @MessageBody()
    data: {
      x: number;
      y: number;
      color: string;
      pseudo: string;
    },
  ): void {
    this.pixelWarsService.updatePixel(data.x, data.y, data.color, data.pseudo);
    this.server.emit('pixelUpdate', data);
  }
  @SubscribeMessage('chatMessage')
  handleChatMessage(
    @MessageBody() data: { pseudo: string; message: string },
  ): void {
    this.server.emit('chatMessage', data);
  }
}
