import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto } from './dto';
import { DatabaseService } from '../database/database.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
    private readonly databaseService: DatabaseService,
  ) {}

  async signUp(data: SignUpDto) {
    const hash = await argon.hash(data.password);
    const createdUser = await this.usersService.create({
      phoneNumber: data.phoneNumber,
      password: hash,
    });
    const accessToken = await this.signAccessToken(
      createdUser.user.id,
      createdUser.user.phoneNumber,
    );
    return { ...createdUser.user, accessToken };
  }

  async signIn(data: SignInDto) {
    const user = await this.databaseService.users.findUnique({
      where: {
        phoneNumber: data.phoneNumber,
      },
    });

    if (!user) throw new UnauthorizedException('Incorrect phone or password');
    const verified = await argon.verify(user.password, data.password);
    if (!verified)
      throw new UnauthorizedException('Incorrect phone or password');

    const accessToken = await this.signAccessToken(user.id, user.phoneNumber);
    return { ...user, accessToken };
  }

  signAccessToken(id: string, phoneNumber: string) {
    const payload = { id, phoneNumber };
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
