import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Occurrence } from 'src/modules/reserve/dto/reserveDto';

export class CreateReserveEventDto {
  @ApiProperty({
    example: 'Mercado de trabalho: um questão não muito complexa',
    description: 'Nome do evento',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example:
      'Evento para demonstrar o que acontece no mercado de trabalho atualmente',
    description: 'Descrição do evento',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'Biblioteca',
    description: 'Local de acontecimento do evento',
  })
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    example: 'SEMANALMENTE',
    description: 'Ocorrência da reserva',
  })
  @IsNotEmpty()
  occurrence: Occurrence;

  @ApiProperty({
    example: '26/05/2025, 14:25',
    description: 'Data e hora de ínicio',
  })
  @IsNotEmpty()
  dateTimeStart: string;

  @ApiProperty({
    example: '26/05/2025, 15:25',
    description: 'Data e hora de fim',
  })
  @IsNotEmpty()
  dateTimeEnd: string;
}

export class UpdateReserveEventDto {
  @ApiProperty({
    example: 'Mercado de trabalho: um questão não muito complexa',
    description: 'Nome do evento',
  })
  name?: string;

  @ApiProperty({
    example:
      'Evento para demonstrar o que acontece no mercado de trabalho atualmente',
    description: 'Descrição do evento',
  })
  description?: string;

  @ApiProperty({
    example: 'Biblioteca',
    description: 'Local de acontecimento do evento',
  })
  location?: string;

  @ApiProperty({
    example: 'SEMANALMENTE',
    description: 'Ocorrência da reserva',
  })
  occurrence?: Occurrence;

  @ApiProperty({
    example: '26/05/2025, 14:25',
    description: 'Data e hora de ínicio',
  })
  dateTimeStart: string;

  @ApiProperty({
    example: '26/05/2025, 15:25',
    description: 'Data e hora de fim',
  })
  dateTimeEnd: string;
}
