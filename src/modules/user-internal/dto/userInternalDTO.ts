import { IsNotEmpty } from 'class-validator';
import { Type_User } from 'src/modules/user/dto/userDto';

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
  name?: string;

  password?: string;
}
