import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Ocurrence } from 'src/modules/reserve/dto/reserveDto';

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
  ocurrence: Ocurrence;

  @ApiProperty({
    example: '2025-02-25',
    description: 'Data de ínicio',
  })
  @IsNotEmpty()
  date_Start: string;

  @ApiProperty({
    example: '2025-02-25',
    description: 'Data de fim',
  })
  @IsNotEmpty()
  date_End: string;

  @ApiProperty({
    example: '11:00',
    description: 'Hora de ínicio',
  })
  @IsNotEmpty()
  hour_Start: string;

  @ApiProperty({
    example: '12:00',
    description: 'Hora de fim',
  })
  @IsNotEmpty()
  hour_End: string;
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
  ocurrence?: Ocurrence;

  @ApiProperty({
    example: '2025-02-25',
    description: 'Data de ínicio',
  })
  date_Start: string;

  @ApiProperty({
    example: '2025-02-25',
    description: 'Data de fim',
  })
  date_End: string;

  @ApiProperty({
    example: '11:00',
    description: 'Hora de ínicio',
  })
  hour_Start: string;

  @ApiProperty({
    example: '12:00',
    description: 'Hora de fim',
  })
  hour_End: string;
}
