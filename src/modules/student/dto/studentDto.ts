import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({
    example: 'Aluno nome',
    description: 'Nome do aluno',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '153810',
    description: 'Matrícula do aluno',
  })
  @Length(6, 8)
  @IsNotEmpty()
  registration: string;

  @ApiProperty({
    example: 'aluno@exemplo.com',
    description: 'Email do aluno',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '00000000',
    description: 'Senha do aluno',
  })
  @Length(8, 24)
  @IsNotEmpty()
  password: string;
}

export class UpdateStudentDto {
  @ApiProperty({
    example: 'Aluno nome',
    description: 'Nome do aluno',
  })
  name?: string;

  @ApiProperty({
    example: '00000000',
    description: 'Senha do aluno',
  })
  @Length(8, 24)
  password?: string;
}
