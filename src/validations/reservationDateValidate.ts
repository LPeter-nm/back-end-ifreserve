import { HttpException, HttpStatus } from '@nestjs/common';

export function validateReservationDates(
  dateStart: string,
  dateEnd: string,
  hourStart: string,
  hourEnd,
) {
  const [yearS, monthS, dayS] = dateStart.split('-').map(Number);
  const [hourS, minutesS] = hourStart.split(':').map(Number);

  const [yearE, monthE, dayE] = dateEnd.split('-').map(Number);
  const [hourE, minutesE] = hourEnd.split(':').map(Number);

  const date_Start = new Date(yearS, monthS - 1, dayS, hourS, minutesS);
  const date_End = new Date(yearE, monthE - 1, dayE, hourE, minutesE);

  const currentDate = new Date();

  if (
    date_Start.getTime() < currentDate.getTime() ||
    date_End.getTime() < currentDate.getTime()
  ) {
    console.log('Data de inicio: ', date_Start.toLocaleString('pt-BR'));
    console.log('Data de final: ', date_End.toLocaleString('pt-BR'));
    console.log('Data atual: ', currentDate.toLocaleString('pt-BR'));
    throw new HttpException(
      'Não é permitido registrar reservas em datas anteriores à data atual.',
      HttpStatus.EXPECTATION_FAILED,
    );
  } else {
    return {
      date_Start,
      date_End,
    };
  }

  // if (
  //   dS < currentDate ||
  //   dE < currentDate ||
  //   (hourStart < hourNow && dS < currentDate)
  // ) {
  //   throw new HttpException(
  //     'Não é permitido registrar reservas em datas anteriores à data atual.',
  //     HttpStatus.EXPECTATION_FAILED,
  //   );
  // }
}
