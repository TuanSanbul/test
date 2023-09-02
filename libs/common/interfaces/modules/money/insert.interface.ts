import { MoneyLogSource } from '@lib/common/enums';

export interface IMoneyInsert {
  amount: number;
  username?: string;
  memberId?: string;
  reason: string;
  source?: MoneyLogSource;
}
