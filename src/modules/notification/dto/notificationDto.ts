import { IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateNotificationDto {
  message?: string;

  description?: string;
}
