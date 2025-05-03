import { HttpException, HttpStatus } from '@nestjs/common';

export function validateReservationDates(
  dateStart: Date,
  dateEnd: Date,
  hourStart: string,
) {
  const currentDate = new Date();

  const dateNow = `${currentDate.getFullYear()}-0${currentDate.getUTCMonth() + 1}-0${currentDate.getDate()}`;

  const dateStartStr = `${dateStart.getFullYear()}-0${dateStart.getUTCMonth() + 1}-0${dateStart.getDate() + 1}`;

  const dateEndStr = `${dateEnd.getFullYear()}-0${dateEnd.getUTCMonth() + 1}-0${dateEnd.getDate() + 1}`;

  const hourNow = `${currentDate.getHours()}:${currentDate.getMinutes()}`;

  if (dateStartStr < dateNow || dateEndStr < dateNow || hourStart < hourNow) {
    throw new HttpException(
      'Não é permitido registrar reservas em datas anteriores à data atual.',
      HttpStatus.EXPECTATION_FAILED,
    );
  }
}
