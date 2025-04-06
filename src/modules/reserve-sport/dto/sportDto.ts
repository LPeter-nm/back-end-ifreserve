import { ApiProperty } from '@nestjs/swagger';
import { Ocurrence } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { TypePractice } from 'src/modules/reserve/dto/reserveDto';

export class CreateReserveSportDto {
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

  @ApiProperty({
    example: 'TREINO',
    description: 'Ocorrência da reserva',
  })
  @IsNotEmpty()
  type_Practice: TypePractice;

  @ApiProperty({ example: '12', description: 'Número de participantes' })
  @IsNotEmpty()
  number_People: number;

  @ApiProperty({
    example: 'Fulano 1 - 00000EXP.TMN00000; Fulano 2 - 000.000.000-00; ...',
    description: 'Pessoas que irão participar',
  })
  @IsNotEmpty()
  participants: string;

  @ApiProperty({
    example: 'Bola de vôlei, postes e rede',
    description: 'Equipamentos que foram solicitados para a reserva',
  })
  @IsNotEmpty()
  request_Equipment: string;
}

export class UpdateReserveSportDto {
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

  @ApiProperty({ example: '12', description: 'Número de participantes' })
  number_People?: number;

  @ApiProperty({
    example: 'Fulano 1 - 00000EXP.TMN00000; Fulano 2 - 000.000.000-00; ...',
    description: 'Pessoas que irão participar',
  })
  participants?: string;

  @ApiProperty({
    example: 'Bola de vôlei, postes e rede',
    description: 'Equipamentos que foram solicitados para a reserva',
  })
  request_Equipment?: string;

  @ApiProperty({
    example: 'TREINO',
    description: 'Tipo de prática do ofício (treino, recreação ou amistoso)',
  })
  type_Practice?: TypePractice;

 
}

export class PutCommentsDto {
  @ApiProperty({
    example: 'Sua reserva foi cancelada/recusada por [motivos]',
    description:
      'Comentários para explicação caso sua reserva for cancelada ou recusada',
  })
  comments?: string;
}
