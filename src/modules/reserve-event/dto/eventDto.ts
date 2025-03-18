import { IsNotEmpty } from 'class-validator';
import { Ocurrence } from 'src/modules/reserve/dto/reserveDto';

export class CreateReserveEventDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  location: string;

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

export class UpdateReserveEventDto {
  name?: string;

  description?: string;

  location?: string;

  ocurrence?: Ocurrence;

  date_Start: string;

  date_End: string;

  hour_Start: string;

  hour_End: string;
}
