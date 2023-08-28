import * as moment from 'moment';
import { round } from './number.helper';

export function dateDiff(
  start: Date | string,
  end: Date | string,
  digit: moment.unitOfTime.Diff,
): number {
  const diff = moment(end).diff(moment(start), digit);
  return diff;
}

export function convertDateToSecond(date: Date): number {
  return round(new Date(date).getTime() / 1000, 0);
}

export function addTime(
  period: number,
  digit: moment.unitOfTime.Diff,
  date = new Date(),
): Date {
  return moment(date).add(period, digit).toDate();
}
