import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsSemVer,
  IsString,
} from 'class-validator';

export class sendEmailDto {
  @IsEmail({}, { each: true })
  recipients: string[];

  @IsString()
  subject: string;

  @IsString()
  html: string;

  @IsOptional()
  @IsString()
  text?: string;
}
