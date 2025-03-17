import { Ocurrence } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { TypeReserve } from 'src/modules/reserve/dto/create-reserve.dto';

export enum TypePractice {
  TREINO = 'TREINO',
  RECREACAO = 'RECREACAO',
  AMISTOSO = 'AMISTOSO',
}

export enum StatusSport {
  PENDENTE = 'PENDENTE',
  CONFIRMADA = 'CONFIRMADA',
  RECUSADA = 'RECUSADA',
  CANCELADA = 'CANCELADA',
}

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

export class UpdateStatusSportDto {
  status: StatusSport;

  anseweredBy: string;
}
