import { IsNotEmpty } from 'class-validator';
import { Ocurrence } from 'src/modules/reserve/dto/reserveDto';

export class CreateReserveClassroomDto {
  @IsNotEmpty()
  course: string;

  @IsNotEmpty()
  matter: string;

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
}

export class UpdateReserveClassroomDto {
  course?: string;

  matter?: string;

  ocurrence?: Ocurrence;

  date_Start: string;

  date_End: string;

  hour_Start: string;

  hour_End: string;
}
