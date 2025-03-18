import { Ocurrence } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { TypePractice } from 'src/modules/reserve/dto/reserveDto';

export class CreateReserveSportDto {
  @IsNotEmpty()
  ocurrence: Ocurrence;

  @IsNotEmpty()
  date_Start: string;

  @IsNotEmpty()
  date_End: string;

  @IsNotEmpty()
  hour_Start: string;

  @IsNotEmpty()
  hour_End: string;

  @IsNotEmpty()
  type_Practice: TypePractice;

  @IsNotEmpty()
  number_People: number;

  @IsNotEmpty()
  participants: string;

  @IsNotEmpty()
  request_Equipment: string;
}

export class UpdateReserveSportDto {
  ocurrence?: Ocurrence;

  date_Start?: string;

  date_End?: string;

  hour_Start?: string;

  hour_End?: string;

  number_People?: number;

  participants?: string;

  request_Equipment?: string;

  type_Practice?: TypePractice;

  comments?: string;
}
