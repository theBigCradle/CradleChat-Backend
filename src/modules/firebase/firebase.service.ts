import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { join } from 'path';
import { SendNotificationDto } from './dto';
import { cwd } from 'process';

@Injectable()
export class FirebaseService {
  constructor() {
    const serviceAccountPath =
      process.env.NODE_ENV === 'production'
        ? join(__dirname, '..', '..', 'account-settings.json')
        : join(cwd(), 'src', 'account-settings.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  }
  private logger: Logger = new Logger(FirebaseService.name);

  async sendPushNotification(dto: SendNotificationDto) {
    try {
      const response = await admin.messaging().send({
        notification: {
          title: dto.title,
          body: dto.body,
        },
        android: {
          notification: {
            channelId: 'channel_id', // Match this with your Flutter channel ID
            sound: 'default',
            defaultVibrateTimings: true,
            defaultSound: true,
            priority: 'high',
          },
        },
        data: {
          // You can also send extra data if needed
          click_action: 'FLUTTER_NOTIFICATION_CLICK',
        },
        token: dto.token,
      });

      return response;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
