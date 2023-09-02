import { MemberFilterDate } from '@lib/common/enums';
import {
  ITimerQuery,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces/request';
import { Member } from '@lib/core/databases/postgres';

export interface IQueryFieldsMember extends QueryFields<Member> {
  lastLoginIP?: string;
  tab: number;
  checkDate: MemberFilterDate;
  startTimeMoney?: Date;
  endTimeMoney?: Date;
}

export interface IQueryMember extends ITimerQuery {
  queryFields: IQueryFieldsMember;
  orderFields: OrderFields<Member>;
}

export interface IQueryMemberIP extends Omit<IQueryMember, 'queryFields'> {
  queryFields: Pick<IQueryFieldsMember, 'lastLoginIP'>;
}

export interface IMemberMoney {
  id?: string;
  withdrawCount?: number;
  depositCount?: number;
  withdrawAmount?: number;
  depositAmount?: number;
  revenue?: number;
  lastChargeDate?: Date;
}
