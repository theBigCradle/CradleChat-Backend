import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(data: SignUpDto) {
    const createdUser = await this.usersService.create(data);
    const accessToken = await this.signAccessToken(
      createdUser.user.id,
      createdUser.user.emailAddress,
    );
    return { ...createdUser.user, accessToken };
  }

  signAccessToken(id: string, emailAddress: string) {
    const payload = { id, emailAddress };
    const privateKey = this.config.get('ACCESS_TOKEN_PRIVATE_KEY');
    return this.jwt.signAsync(payload, {
      expiresIn: '10y',
      secret: privateKey,
    });
  }

  verifyAccessToken(token: string) {
    const privateKey = this.config.get('ACCESS_TOKEN_PRIVATE_KEY');
    return this.jwt.verify(token, {
      secret: privateKey,
    });
  }
}
