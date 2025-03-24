import { HttpException, HttpStatus } from '@nestjs/common';

export function validateReservationDates(dateStart: Date, dateEnd: Date) {
  const currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  if (dateStart < currentDate || dateEnd < currentDate) {
    throw new HttpException(
      'Não é permitido registrar reservas em datas anteriores à data atual.',
      HttpStatus.EXPECTATION_FAILED,
    );
  }
}
