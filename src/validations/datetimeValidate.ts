import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

const prisma = new PrismaClient();

export async function checkConflictingReserves(
  dateStart: Date,
  dateEnd: Date,
  hourStart: string,
  hourEnd: string,
) {
  const conflictingReserves = await prisma.reserve.findMany({
    where: {
      date_Start: { lte: dateEnd },
      date_End: { gte: dateStart },
      hour_Start: { lte: hourEnd },
      hour_End: { gte: hourStart },
    },
  });

  if (conflictingReserves.length > 0) {
    throw new HttpException(
      'Já existe uma reserva para o mesmo horário e data',
      HttpStatus.CONFLICT,
    );
  }
}
