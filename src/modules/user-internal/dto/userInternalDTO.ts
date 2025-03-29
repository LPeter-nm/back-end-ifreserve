import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserInternalDto {
  @ApiProperty({
    example: 'Fulano name',
    description: 'Nome do usuário interno',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Email do usuário interno',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '00000000',
    description: 'Senha do usuário externo',
  })
  @Length(8, 24)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '00000EXP.TMN0000',
    description: 'Matrícula do usuário externo',
  })
  @IsNotEmpty()
  registration: string;
}

export class UpdateUserInternalDto {
  @ApiProperty({
    example: 'Fulano name',
    description: 'Nome do usuário interno',
  })
  name?: string;

  @ApiProperty({
    example: '00000000',
    description: 'Senha do usuário externo',
  })
  @Length(8, 24)
  password?: string;
}
