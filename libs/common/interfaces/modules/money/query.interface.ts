import { PointType } from '@lib/common/enums';
import { MoneyLog } from '@lib/core/databases/postgres';
import { IQueryMessage } from '../../request';

export type MoneyFilterBy = {
  type: PointType;
  roleId: string;
};
export type MoneyQuery = IQueryMessage<MoneyLog> & {
  filterBy: MoneyFilterBy;
};
