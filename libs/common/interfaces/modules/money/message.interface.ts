import { IJwtPayload } from '../auth';
import { IMoneyInsert } from './insert.interface';
import { MoneyQuery } from './query.interface';

export interface IMoneyMessage {
  payload: MoneyQuery | IMoneyInsert;
  request?: IJwtPayload;
}
