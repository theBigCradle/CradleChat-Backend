import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Module({
  imports:[JwtModule.register({}),],
  controllers: [AuthController],
  providers: [AuthService, UsersService]
})
export class AuthModule {}
