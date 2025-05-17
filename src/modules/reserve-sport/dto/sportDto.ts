import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Occurrence, TypePractice } from 'src/modules/reserve/dto/reserveDto';

export class CreateReserveSportDto {
  @ApiProperty({
    example: 'SEMANALMENTE',
    description: 'Ocorrência da reserva',
  })
  @IsNotEmpty()
  occurrence: Occurrence;

  @ApiProperty({
    example: '08/05/2025, 14:00',
    description: 'Data e hora de ínicio',
  })
  @IsNotEmpty()
  dateTimeStart: string;

  @ApiProperty({
    example: '08/05/2025, 15:00',
    description: 'Data e hora de fim',
  })
  @IsNotEmpty()
  dateTimeEnd: string;

  @ApiProperty({
    example: 'TREINO',
    description: 'Ocorrência da reserva',
  })
  @IsNotEmpty()
  typePractice: TypePractice;

  @ApiProperty({ example: '12', description: 'Número de participantes' })
  @IsNotEmpty()
  numberParticipants: string;

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
  requestEquipment: string;

  @ApiProperty({
    description: 'Arquivo em PDF',
    type: 'string',
    format: 'binary',
    required: false,
  })
  pdfFile?: any;
}

export class UpdateReserveSportDto {
  @ApiProperty({
    example: 'SEMANALMENTE',
    description: 'Ocorrência da reserva',
  })
  occurrence?: Occurrence;

  @ApiProperty({
    example: '08/05/2025, 14:00',
    description: 'Data e hora de ínicio',
  })
  dateTimeStart: string;

  @ApiProperty({
    example: '08/05/2025, 15:00',
    description: 'Data e hora de fim',
  })
  dateTimeEnd: string;

  @ApiProperty({ example: '12', description: 'Número de participantes' })
  numberParticipants?: number;

  @ApiProperty({
    example: 'Fulano 1 - 00000EXP.TMN00000; Fulano 2 - 000.000.000-00; ...',
    description: 'Pessoas que irão participar',
  })
  participants?: string;

  @ApiProperty({
    example: 'Bola de vôlei, postes e rede',
    description: 'Equipamentos que foram solicitados para a reserva',
  })
  requestEquipment?: string;

  @ApiProperty({
    example: 'TREINO',
    description: 'Tipo de prática do ofício (treino, recreação ou amistoso)',
  })
  typePractice?: TypePractice;
}
