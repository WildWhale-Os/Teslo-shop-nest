import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';

export interface SocketClient {
  [id: string]: {
    socket: Socket;
    user: User;
  };
}
