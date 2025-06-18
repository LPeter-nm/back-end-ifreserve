import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { FunctionServer } from 'src/modules/user/dto/userDto';

export class CreateServerDto {
  @ApiProperty({
    example: 'Servidor name',
    description: 'Nome do servidor',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '153810',
    description: 'Matrícula do servidor',
  })
  @Length(6, 8)
  @IsNotEmpty()
  identification: string;

  @ApiProperty({
    example: 'Professor de educação física',
    description: 'Função do servidor no Instituto',
  })
  @IsNotEmpty()
  roleInInstitution: FunctionServer;

  @ApiProperty({
    example: 'servidor@example.com',
    description: 'Email do servidor',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '00000000',
    description: 'Senha do servidor',
  })
  @Length(8, 24)
  @IsNotEmpty()
  password: string;
}

export class UpdateServerDto {
  @ApiProperty({
    example: 'Servidor name',
    description: 'Nome do servidor',
  })
  name?: string;

  @ApiProperty({
    example: 'Professor de educação física',
    description: 'Função do servidor no Instituto',
  })
  roleInInstitution?: FunctionServer;

  @ApiProperty({
    example: '00000000',
    description: 'Senha do servidor',
  })
  @Length(8, 24)
  password?: string;
}

export class CompleteServerDto {
  @ApiProperty({
    example: '153810',
    description: 'Matrícula do servidor',
  })
  @Length(6, 8)
  @IsNotEmpty()
  identification: string;

  @ApiProperty({
    example: 'Professor de educação física',
    description: 'Função do servidor no Instituto',
  })
  @IsNotEmpty()
  roleInInstitution: FunctionServer;

  @ApiProperty({
    example: '00000000',
    description: 'Senha do servidor',
  })
  @Length(8, 24)
  @IsNotEmpty()
  password: string;
}
