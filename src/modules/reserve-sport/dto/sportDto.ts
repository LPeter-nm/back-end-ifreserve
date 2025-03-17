import { Ocurrence } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { TypePractice, TypeReserve } from 'src/modules/reserve/dto/reserveDto';

export class CreateReserveSportDto {
  @IsNotEmpty()
  typeReserve: TypeReserve;

  @IsNotEmpty()
  ocurrence: Ocurrence;

  @IsNotEmpty()
  number_People: number;

  @IsNotEmpty()
  participants: string;

  @IsNotEmpty()
  request_Equipment: string;

  @IsNotEmpty()
  type_Practice: TypePractice;

  @IsNotEmpty()
  date_Start: string;

  @IsNotEmpty()
  date_End: string;

  @IsNotEmpty()
  hour_Start: string;

  @IsNotEmpty()
  hour_End: string;
}

export class UpdateReserveSportDto {
  comments?: string;

  ocurrence?: Ocurrence;

  number_People?: number;

  participants?: string;

  request_Equipment?: string;

  type_Practice?: TypePractice;

  date_Start?: string;

  date_End?: string;

  hour_Start?: string;

  hour_End?: string;
}
