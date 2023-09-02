import { Module } from '@nestjs/common';
import { DepositModule } from './deposit';
import { WithdrawalModule } from './withdrawal';
import { HistoryModule } from './history';

@Module({
  imports: [DepositModule, WithdrawalModule, HistoryModule],
  providers: [],
})
export class TransactionModule {}
