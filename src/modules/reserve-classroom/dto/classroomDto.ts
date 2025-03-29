import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Ocurrence } from 'src/modules/reserve/dto/reserveDto';

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
