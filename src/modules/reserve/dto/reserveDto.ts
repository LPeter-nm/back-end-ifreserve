import { ApiProperty } from '@nestjs/swagger';

export enum TypeReserve {
  OFICIO = 'OFICIO',
  EVENTO = 'EVENTO',
  AULA = 'AULA',
}

export enum Occurrence {
  EVENTO_UNICO = 'EVENTO_UNICO',
  SEMANALMENTE = 'SEMANALMENTE',
}

export enum TypePractice {
  TREINO = 'TREINO',
  RECREACAO = 'RECREACAO',
  AMISTOSO = 'AMISTOSO',
}

export enum Status {
  CADASTRADO = 'CADASTRADO',
  PENDENTE = 'PENDENTE',
  CONFIRMADA = 'CONFIRMADA',
  RECUSADA = 'RECUSADA',
  CANCELADA = 'CANCELADA',
}

export class PutCommentsDto {
  @ApiProperty({
    example: 'Sua reserva foi cancelada/recusada por [motivos]',
    description:
      'Comentários para explicação caso sua reserva for cancelada ou recusada',
  })
  comments?: string;
}
