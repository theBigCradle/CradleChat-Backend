import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [AuthModule],
  providers: [ChatGateway],
})
export class ChatModule {}
