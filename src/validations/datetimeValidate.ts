import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

const prisma = new PrismaClient();

export async function checkConflictingReserves(
  dateTimeStart: Date,
  dateTimeEnd: Date,
) {
  const conflictingReserves = await prisma.reserve.findMany({
    where: {
      dateTimeStart: { lte: dateTimeStart },
      dateTimeEnd: { gte: dateTimeEnd },
    },
  });

  if (conflictingReserves.length > 0) {
    throw new HttpException(
      'Já existe uma reserva para o mesmo horário e data',
      HttpStatus.CONFLICT,
    );
  }
}
