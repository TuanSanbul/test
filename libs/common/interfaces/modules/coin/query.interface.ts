import { CoinLog } from '@lib/core/databases/postgres';
import { IQueryMessage } from '../../request';
import { IJwtPayload } from '../auth';
import { ICoinInsert } from './insert.interface';

export type CoinLogQuery = IQueryMessage<CoinLog>;

export interface ICoinMessage {
  payload: CoinLogQuery | ICoinInsert;
  request?: IJwtPayload;
}
