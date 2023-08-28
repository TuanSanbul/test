import { Module } from '@nestjs/common';
import { WithdrawalModule } from './withdrawal';
import { HistoryModule } from './history';

@Module({
  imports: [WithdrawalModule, HistoryModule],
  providers: [],
})
export class TransactionModule {}
