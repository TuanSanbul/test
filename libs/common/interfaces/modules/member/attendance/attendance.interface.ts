import { AttendanceTabEnum } from '@lib/common/enums';
import { ITimerQuery, QueryFields } from '@lib/common/interfaces/request';
import { Attendance, Member } from '@lib/core/databases/postgres';

export interface IPayloadCreateAttendance {
  username: string;
}

export interface IQueryFieldsAttendance
  extends QueryFields<Attendance & Member> {
  tab: AttendanceTabEnum;
}

export interface IQueryAttendance extends ITimerQuery {
  queryFields: IQueryFieldsAttendance;
}
