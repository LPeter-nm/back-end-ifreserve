const testDate = '2025-05-06';
const testHour = '13:10';

const [year, month, day] = testDate.split('-').map(Number);
const [hour, minutes] = testHour.split(':').map(Number);

// Cria a data de teste em UTC (sem ajuste de fuso horário)
const date = new Date(year, month - 1, day, hour, minutes);
const now = new Date();

if (date.getTime() > now.getTime()) {
  console.log('A data de teste é FUTURA em relação à atual');
} else {
  console.log('A data de teste é PASSADA ou IGUAL à atual');
}

const dateBr = date.toLocaleString('pt-BR');

const [dateInsert, timeInsert] = date.toLocaleString().split(', ');

console.log(dateInsert, timeInsert);
