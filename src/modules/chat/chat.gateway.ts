import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
  // transports: ['websocket', 'polling'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly authService: AuthService) {}
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
      const decoded = this.authService.verifyAccessToken(payload.token);
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
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: { toUserId: string; content: string },
  ) {
    const sender = (client as any).user;
    if (!sender) {
      return client.emit('unauthorized');
    }

    // 1. Save the message to the DB
    // const savedMessage = await this.messagesService.save({
    //   from: sender.id,
    //   to: message.toUserId,
    //   content: message.content,
    //   timestamp: new Date(),
    // });

    this.logger.log(`Decoded: ${JSON.stringify(message)}`);

    // 2. Emit real-time to recipient
    // client.to(`user:${message.toUserId}`).emit('newMessage', savedMessage);

    // 3. Optionally emit back to sender for confirmation
    // client.emit('messageSent', savedMessage);

    // emit to the recipient's room
    client.to(`user:${message.toUserId}`).emit('newMessage', {
      from: sender.id,
      content: message.content,
    });
  }
}
