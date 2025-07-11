import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { SendNotificationDto } from './dto';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('send-notification')
  signUp(@Body(ValidationPipe) signUpDto: SendNotificationDto) {
    return this.firebaseService.sendPushNotification(signUpDto);
  }
}
