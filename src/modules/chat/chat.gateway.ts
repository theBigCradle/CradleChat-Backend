import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // adjust in production
  },
  namespace: '/',
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  constructor(private readonly jwtService: JwtService) {}
  private logger: Logger = new Logger(ChatGateway.name);

  async handleConnection(client: Socket) {
    this.logger.log(`Socket connected: ${client.id}`);
    // Don't authenticate here yet — wait for 'authenticate' event
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected: ${client.id}`);
  }

  @SubscribeMessage('authenticate')
  async handleAuth(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { token: string },
  ) {
    try {
      const decoded = this.jwtService.verify(payload.token);
      this.logger.log(`Authenticated user: ${decoded.id}`);

      // Store user data on socket
      (client as any).user = decoded;

      // Join a room based on user ID
      client.join(`user:${decoded.id}`);

      client.emit('authenticated', { success: true });
    } catch (error) {
      this.logger.warn(`Authentication failed: ${error.message}`);
      client.emit('unauthorized');
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: { toUserId: string; content: string },
  ) {
    const sender = (client as any).user;
    if (!sender) {
      return client.emit('unauthorized');
    }

    // emit to the recipient's room
    client.to(`user:${message.toUserId}`).emit('newMessage', {
      from: sender.id,
      content: message.content,
    });
  }
}
