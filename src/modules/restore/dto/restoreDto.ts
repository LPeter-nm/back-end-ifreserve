import { IsNotEmpty, Length } from 'class-validator';

export class PasswordRedefinition {
  @IsNotEmpty()
  email: string;
}

export class TokenConfirmed {
  @IsNotEmpty()
  tokenId: string;

  @Length(4)
  @IsNotEmpty()
  token: string;
}

export class NewPassword {
  @IsNotEmpty()
  tokenId: string;

  @IsNotEmpty()
  @Length(6, 18)
  password: string;
}
