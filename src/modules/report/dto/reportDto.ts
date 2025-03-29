import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    example: 'Fulano 1 - 00000EXP.TMN00000; Fulano 2 - 000.000.000-00; ...',
    description: 'Pessoas que apareceram na quadra no momento da reserva',
  })
  @IsNotEmpty()
  people_Appear: string;

  @ApiProperty({
    example: 'Bola de vôlei, postes e rede',
    description: 'Equipamentos que foram solicitados para a reserva',
  })
  @IsNotEmpty()
  requested_Equipment: string;

  @ApiProperty({
    example: 'A quadra estava bem limpa',
    description: 'Descrição da quadra',
  })
  @IsNotEmpty()
  description_Court: string;

  @ApiProperty({
    example: 'Os equipamentos estavam em ótimas condições',
    description: 'Descrição dos equipamentos solicitados',
  })
  @IsNotEmpty()
  description_Equipment: string;

  @ApiProperty({
    example: '1h30',
    description: 'Tempo de uso da quadra',
  })
  @IsNotEmpty()
  time_Used: string;

  @ApiProperty({
    example: '2025-03-15',
    description: 'Data de uso da quadra',
  })
  @IsNotEmpty()
  date_Used: string;

  @ApiProperty({
    example: 'A reserva ocorreu tranquilamente',
    description: 'descrição livre do usuário sobre a reserva',
  })
  description?: string;
}

export class UpdateReportDto {
  @ApiProperty({
    example: 'Fulano 1 - 00000EXP.TMN00000; Fulano 2 - 000.000.000-00; ...',
    description: 'Pessoas que apareceram na quadra no momento da reserva',
  })
  people_Appear?: string;

  @ApiProperty({
    example: 'Bola de vôlei, postes e rede',
    description: 'Equipamentos que foram solicitados para a reserva',
  })
  requested_Equipment?: string;

  @ApiProperty({
    example: 'A quadra estava bem limpa',
    description: 'Descrição da quadra',
  })
  description_Court?: string;

  @ApiProperty({
    example: 'Os equipamentos estavam em ótimas condições',
    description: 'Descrição dos equipamentos solicitados',
  })
  description_Equipment?: string;

  @ApiProperty({
    example: '1h30',
    description: 'Tempo de uso da quadra',
  })
  time_Used?: string;

  @ApiProperty({
    example: '2025-03-15',
    description: 'Data de uso da quadra',
  })
  date_Used?: string;

  @ApiProperty({
    example: 'A reserva ocorreu tranquilamente',
    description: 'descrição livre do usuário sobre a reserva',
  })
  description?: string;

  @ApiProperty({
    example: 'Obrigado por utilizar nossa quadra e que venha mais vezes',
    description: 'comentário do servidor que irá visualizar o relatório',
  })
  comments?: string;
}
