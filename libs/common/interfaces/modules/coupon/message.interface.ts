import { IJwtPayload } from '../auth';
import { ICouponExchange } from './exchange.interface';
import { CouponLogQuery } from './query.interface';
import { ICouponConfig } from './update.interface';
import { ICouponUsed } from './used.interface';

export interface ICouponMessage {
  payload: CouponLogQuery | ICouponExchange | ICouponConfig | ICouponUsed;
  request?: IJwtPayload;
}
