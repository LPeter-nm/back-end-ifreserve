import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class PasswordRedefinition {
  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Email para recuperação de senha',
  })
  @IsNotEmpty()
  email: string;
}

export class TokenConfirmed {
  @ApiProperty({
    example: '14a28727-0f01-4215-8706-a597d513a82d',
    description: 'Id do token (será automático no front end)',
  })
  @IsNotEmpty()
  tokenId: string;

  @ApiProperty({
    example: '0000',
    description: 'Token enviado no email',
  })
  @Length(4)
  @IsNotEmpty()
  token: string;
}

export class NewPassword {
  @ApiProperty({
    example: '14a28727-0f01-4215-8706-a597d513a82d',
    description: 'Id do token (será automático no front end)',
  })
  @IsNotEmpty()
  tokenId: string;

  @ApiProperty({
    example: '00000000',
    description: 'Nova senha',
  })
  @IsNotEmpty()
  @Length(8, 24)
  password: string;
}
