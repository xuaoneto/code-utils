function isLeapYear(year: number | string) {
  if (typeof year === "string") year = Number(year);

  if ((year % 4 == 0 && year % 100 != 0) || 0 == year % 400) {
    return true;
  } else {
    return false;
  }
}

function getLastMonthDays(
  year: number,
  monthIndex: number,
  monthDaysLimitArray: number[]
) {
  const firstDayIndex = new Date(year, monthIndex, 1).getDay();
  const lastMonthDays: CalendarDay[] = [];
  for (let subtract = 0; subtract < firstDayIndex; subtract++) {
    const day = monthDaysLimitArray.at(monthIndex - 1)! - subtract;
    const currMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
    lastMonthDays.push({
      day,
      outOfMonth: true,
      date: new Date(year, currMonthIndex, day),
    });
  }
  return lastMonthDays;
}

function getNextMonthDays(
  year: number,
  monthIndex: number,
  lastMonthDaysLength: number,
  currentMonthDaysLength: number,
  calendarSize: number
) {
  const completeCalendarSize =
    calendarSize - (lastMonthDaysLength + currentMonthDaysLength);
  const nextMonthDays: CalendarDay[] = [];
  for (let dayIndex = 0; dayIndex < completeCalendarSize; dayIndex++) {
    const day = dayIndex + 1;
    const currMonthIndex = monthIndex === 11 ? 0 : monthIndex + 1;
    nextMonthDays.push({
      day,
      outOfMonth: true,
      date: new Date(year, currMonthIndex, day),
    });
  }
  return nextMonthDays;
}

// new Date(ano, mês, dia, hora, minuto, segundo, milissegundo);
export function calendarArray(date: Date) {
  const width = 7;
  const height = 6;
  const weekDayIndex = date.getDay();
  const monthDay = date.getDate();
  const year = date.getFullYear();
  const currentMonthIndex = date.getMonth();

  const calendarSize = width * height;

  // prettier-ignore
  const weekDays = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  // prettier-ignore
  const months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

  const abbreviatedMonths = months.map((month) => month.slice(0, 3));
  const abbreviatedWeekDays = weekDays.map((day) => day.slice(0, 3));

  const monthDaysLimitArray = isLeapYear(year)
    ? [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // prettier-ignore
  const calendar: CalendarMonth[] = [[],[],[],[],[],[],[],[],[],[],[],[]];

  for (let index = 0; index < months.length; index++) {
    const daysLimit = monthDaysLimitArray[index];
    const currentMonth = calendar[index];
    const lastDays = getLastMonthDays(year, index, monthDaysLimitArray);
    for (let dayIndex = 0; dayIndex < daysLimit; dayIndex++)
      currentMonth.push({
        day: dayIndex + 1,
        date: new Date(year, currentMonthIndex, dayIndex + 1),
      });
    const nextDays = getNextMonthDays(
      year,
      currentMonthIndex,
      lastDays.length,
      daysLimit,
      calendarSize
    );
    calendar[index] = [...lastDays, ...currentMonth, ...nextDays];
  }

  return {
    months,
    currentMonthName: months[currentMonthIndex],
    currentMonthDays: calendar[currentMonthIndex],
    currentMonthIndex,
    abbreviatedMonths,
    weekDays,
    abbreviatedWeekDays,
    calendar,
    weekDayIndex,
    monthDay,
    currentYear: year,
  };
}

// Types
type CalendarMonth = CalendarDay[];
interface CalendarDay {
  day: number;
  date: Date;
  outOfMonth?: boolean;
}
