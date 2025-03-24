import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'fulano@example.com',
    description: 'Campo para email registrado no sistema',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '00000000',
    description: 'Campo para senha registrada no sistema',
  })
  @IsNotEmpty()
  password: string;
}
