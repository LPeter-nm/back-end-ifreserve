import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

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
  registration: string;

  @ApiProperty({
    example: 'Professor de Física',
    description: 'Função do servidor no Instituto',
  })
  @IsNotEmpty()
  function_Server: string;

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
    example: 'Professor de Física',
    description: 'Função do servidor no Instituto',
  })
  function_Server?: string;

  @ApiProperty({
    example: '00000000',
    description: 'Senha do servidor',
  })
  @Length(8, 24)
  password?: string;
}
