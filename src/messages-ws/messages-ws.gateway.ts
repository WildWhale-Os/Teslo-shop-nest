import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dtos/message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wsS: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  handleDisconnect(client: Socket) {
    // Remove the client from the connected clients list
    this.messagesWsService.removeClient(client.id);
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.addClient(client, payload.id);
    } catch (error) {
      console.log(error);
      client.disconnect();
      return;
    }
    // Add the client to the connected clients list
    this.wsS.emit('clients', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleClientMessages(client: Socket, payload: MessageDto) {
    // console.log({ client: client.id, payload });

    //! Emitir para el que envio
    // client.emit('server-message', {
    //   fullName: 'Yo!',
    //   message: payload.message || 'no-message!',
    // });

    //! Emitir para todos menos el que envio
    // client.broadcast.emit('server-messsage', {
    //   fullName: 'Yo!',
    //   message: payload.message || 'no-message!',
    // });

    //! Emitir para todos
    this.wsS.emit('server-messsage', {
      fullName: this.messagesWsService.getUserBySocketId(client.id).fullName,
      message: payload.message || 'no-message!',
    });
  }
}
