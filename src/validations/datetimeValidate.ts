import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { parseDateTime } from './reservationDateValidate';

const prisma = new PrismaClient();

export async function checkConflictingReserves(
  dateTimeStart: string,
  dateTimeEnd: string,
  reserveId?: string,
) {
  const dateTime_Start = parseDateTime(dateTimeStart);
  const dateTime_End = parseDateTime(dateTimeEnd);

  const conflictingReserves = await prisma.reserve.findFirst({
    where: {
      AND: [
        { OR: [{ status: 'CADASTRADO' }, { status: 'CONFIRMADA' }] },
        {
          OR: [
            // Novo horário começa durante um existente
            {
              dateTimeStart: { lt: dateTime_End },
              dateTimeEnd: { gt: dateTime_Start },
            },
            // Novo horário termina durante um existente
            {
              dateTimeStart: { lt: dateTime_End },
              dateTimeEnd: { gt: dateTime_Start },
            },
            // Novo horário envolve um existente completamente
            {
              dateTimeStart: { gte: dateTime_Start },
              dateTimeEnd: { lte: dateTime_End },
            },
          ],
        },
      ],
    },
  });

  if (conflictingReserves && reserveId != conflictingReserves?.id) {
    throw new HttpException(
      'Já existe uma reserva para o mesmo horário e data',
      HttpStatus.CONFLICT,
    );
  }
}
