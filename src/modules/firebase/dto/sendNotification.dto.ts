import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({
    example:
      'cGXg93AlTuqX06AyAsw8au:APA91bGx2-KVDyJ4WbeTFHYiVgXoho69HOMRzrTBdrd_gcpmZWiUHYPVvWnHYNatMkK3yJzxfnMDYN03p-xriGs4a4Nzs4mUld6TnWKH9ugmu6mODhjs6kk',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    example: 'notification title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'notification body',
  })
  @IsNotEmpty()
  @IsString()
  body: string;
}
