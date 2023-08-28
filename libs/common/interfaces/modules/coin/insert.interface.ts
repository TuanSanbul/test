import { CoinLogSource, CoinLogStatus } from '@lib/common/enums';

export interface ICoinInsert {
  amount: number;
  username: string;
  reason: string;
  status?: CoinLogStatus;
  source?: CoinLogSource;
}
