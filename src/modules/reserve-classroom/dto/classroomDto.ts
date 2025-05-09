import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Occurrence } from 'src/modules/reserve/dto/reserveDto';

export class CreateReserveClassroomDto {
  @ApiProperty({
    example: 'Administração 2021',
    description: 'Nome do curso da reserva de aula',
  })
  @IsNotEmpty()
  course: string;

  @ApiProperty({
    example: 'Educação Física',
    description: 'Nome da matéria da reserva de aula',
  })
  @IsNotEmpty()
  matter: string;

  @ApiProperty({
    example: 'SEMANALMENTE',
    description: 'Ocorrência da reserva',
  })
  @IsNotEmpty()
  ocurrence: Occurrence;

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

export class UpdateReserveClassroomDto {
  @ApiProperty({
    example: 'Administração 2021',
    description: 'Nome do curso da reserva de aula',
  })
  course?: string;

  @ApiProperty({
    example: 'Educação Física',
    description: 'Nome da matéria da reserva de aula',
  })
  matter?: string;

  @ApiProperty({
    example: 'SEMANALMENTE',
    description: 'Ocorrência da reserva',
  })
  ocurrence?: Occurrence;

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
