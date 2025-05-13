import { HttpException, HttpStatus } from '@nestjs/common';

export function parseDateTime(dateTimeStr: string): Date {
  const [datePart, timePart] = dateTimeStr.split(',').map((s) => s.trim());
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);

  return new Date(year, month - 1, day, hours, minutes);
}

export function validateReservationDates(
  dateTimeStart: string,
  dateTimeEnd: string,
) {
  const dateTime_Start = parseDateTime(dateTimeStart);
  const dateTime_End = parseDateTime(dateTimeEnd);
  const currentDate = new Date();

  if (isNaN(dateTime_Start.getTime()) || isNaN(dateTime_End.getTime())) {
    throw new HttpException(
      'Formato de data/hora inválido. Use "dd/MM/yyyy, HH:mm".',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (
    dateTime_Start.getTime() < currentDate.getTime() ||
    dateTime_End.getTime() < currentDate.getTime()
  ) {
    throw new HttpException(
      'Não é permitido registrar reservas em datas anteriores à data atual.',
      HttpStatus.EXPECTATION_FAILED,
    );
  }

  if (dateTime_Start.getTime() >= dateTime_End.getTime()) {
    throw new HttpException(
      'A data/hora de início deve ser anterior à data/hora de fim.',
      HttpStatus.BAD_REQUEST,
    );
  }

  return {
    dateTime_Start,
    dateTime_End,
  };
}
