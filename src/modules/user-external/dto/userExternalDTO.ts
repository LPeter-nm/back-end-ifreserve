import { IsNotEmpty } from 'class-validator';

export class CreateUserExternalDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  cpf: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  address: string;
}

export class UpdateUserExternalDto {
  name?: string;

  password?: string;

  phone?: string;

  address?: string;
}
