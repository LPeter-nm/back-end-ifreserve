import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    example: 'Fulano 1 - 00000EXP.TMN00000; Fulano 2 - 000.000.000-00; ...',
    description: 'Pessoas que apareceram na quadra no momento da reserva',
  })
  @IsNotEmpty()
  peopleAppear: string;

  @ApiProperty({
    example: 'Bola de vôlei, postes e rede',
    description: 'Equipamentos que foram solicitados para a reserva',
  })
  @IsNotEmpty()
  requestedEquipment: string;

  @ApiProperty({
    example: 'A quadra estava bem limpa',
    description: 'Descrição da quadra',
  })
  @IsNotEmpty()
  courtCondition: string;

  @ApiProperty({
    example: 'Os equipamentos estavam em ótimas condições',
    description: 'Descrição dos equipamentos solicitados',
  })
  @IsNotEmpty()
  equipmentCondition: string;

  @ApiProperty({
    example: '1h30',
    description: 'Tempo de uso da quadra',
  })
  @IsNotEmpty()
  timeUsed: string;

  @ApiProperty({
    example: '15/05/2025',
    description: 'Data de uso da quadra',
  })
  @IsNotEmpty()
  dateUsed: string;

  @ApiProperty({
    example: 'A reserva ocorreu tranquilamente',
    description: 'descrição livre do usuário sobre a reserva',
  })
  generalComments?: string;
}

export class UpdateReportDto {
  @ApiProperty({
    example: 'Fulano 1 - 00000EXP.TMN00000; Fulano 2 - 000.000.000-00; ...',
    description: 'Pessoas que apareceram na quadra no momento da reserva',
  })
  peopleAppear?: string;

  @ApiProperty({
    example: 'Bola de vôlei, postes e rede',
    description: 'Equipamentos que foram solicitados para a reserva',
  })
  requestedEquipment?: string;

  @ApiProperty({
    example: 'A quadra estava bem limpa',
    description: 'Descrição da quadra',
  })
  courtCondition?: string;

  @ApiProperty({
    example: 'Os equipamentos estavam em ótimas condições',
    description: 'Descrição dos equipamentos solicitados',
  })
  equipmentCondition?: string;

  @ApiProperty({
    example: '1h30',
    description: 'Tempo de uso da quadra',
  })
  timeUsed?: string;

  @ApiProperty({
    example: '2025-03-15',
    description: 'Data de uso da quadra',
  })
  dateUsed?: string;

  @ApiProperty({
    example: 'A reserva ocorreu tranquilamente',
    description: 'descrição livre do usuário sobre a reserva',
  })
  generalComments?: string;
}

export class UpdateWithComment {
  @ApiProperty({
    example: 'A reserva foi recusada por tais motivos...',
    description:
      'Comentário opcional do admnistrador sobre os motivos de recusa',
  })
  commentsAdmin?: string;
}
