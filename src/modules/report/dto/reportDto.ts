import { IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  people_Appear: string;

  @IsNotEmpty()
  requested_Equipment: string;

  @IsNotEmpty()
  description_Court: string;

  @IsNotEmpty()
  description_Equipment: string;

  @IsNotEmpty()
  time_Used: string;

  @IsNotEmpty()
  date_Used: string;

  description?: string;
}

export class UpdateReportDto {
  people_Appear?: string;

  requested_Equipment?: string;

  description_Court?: string;

  description_Equipment?: string;

  time_Used?: string;

  date_Used?: string;

  description?: string;
}
