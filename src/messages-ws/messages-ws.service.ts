import { Injectable } from '@nestjs/common';
import { SocketClient } from './interfaces/socket-client.interface';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessagesWsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  private connectedClients: SocketClient = {};
  removeClient(id: string) {
    delete this.connectedClients[id];
  }
  async addClient(socket: Socket, id: string) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new Error('User not Found');
    if (!user.isActive) throw new Error("User isn't active");
    const client = Object.values(this.connectedClients).filter(
      (conn) => conn.user.id === id,
    );
    if (client.length) {
      client.forEach((conn) => {
        conn.socket.disconnect();
      });
      this.removeClient(socket.id);
    }
    this.connectedClients[socket.id] = {
      socket,
      user,
    };
    console.log(`Socket with id ${socket.id} added`);
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserBySocketId(socketId: string) {
    return this.connectedClients[socketId].user;
  }
}
