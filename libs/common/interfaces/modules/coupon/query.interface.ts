import { CouponFilterBy } from '@lib/common/enums';
import { CouponLog } from '@lib/core/databases/postgres';
import { IQueryMessage } from '../../request';

export type CouponLogQuery = IQueryMessage<CouponLog> & {
  filterBy: CouponFilterBy;
};
