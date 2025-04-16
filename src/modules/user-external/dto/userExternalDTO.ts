import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserExternalDto {
  @ApiProperty({
    example: 'Fulano name',
    description: 'Nome do usuário externo',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Email do usuário externo',
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
    example: '000.000.000-00',
    description: 'CPF do usuário externo',
  })
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({
    example: '(00) 00000-0000',
    description: 'Telefone do usuário externo',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'Rua 0; bairro 0; n. 0000',
    description: 'Endereço do usuário externo',
  })
  @IsNotEmpty()
  address: string;

}

export class UpdateUserExternalDto {
  @ApiProperty({
    example: 'Fulano name',
    description: 'Nome do usuário externo',
  })
  name?: string;

  @ApiProperty({
    example: '000000',
    description: 'Senha do usuário externo',
  })
  password?: string;

  @ApiProperty({
    example: '(00) 00000-0000',
    description: 'Telefone do usuário externo',
  })
  phone?: string;

  @ApiProperty({
    example: 'Rua 0; bairro 0; n. 0000',
    description: 'Endereço do usuário externo',
  })
  address?: string;
}
