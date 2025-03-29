import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Type_User {
  ALUNO = 'ALUNO',
  SERVIDOR = 'SERVIDOR',
  EXTERNO = 'EXTERNO',
}

export class CreateUserDto {
  @ApiProperty({
    example: 'ALUNO',
    description: 'Tipo de usuário (Aluno, externo ou servidor)',
  })
  @IsNotEmpty()
  type_User: Type_User;
}
