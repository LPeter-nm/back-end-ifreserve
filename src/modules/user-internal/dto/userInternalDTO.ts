import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserInternalDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  registration: string;
}

export class UpdateUserInternalDto {
  @IsOptional()
  name?: string;

  password?: string;
}
