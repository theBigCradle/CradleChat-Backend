import {
  Injectable
} from '@nestjs/common';
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
      createdUser.user.emailAddress,
    );
    return { ...createdUser.user, accessToken };
  }

  signAccessToken(emailAddress: string) {
    const payload = { emailAddress };
    const privateKey = this.config.get('ACCESS_TOKEN_PRIVATE_KEY');
    return this.jwt.signAsync(payload, {
      expiresIn: '10y',
      secret: privateKey,
    });
  }
}
