import {
  Body,
  Controller,
  Post,
  ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

}
