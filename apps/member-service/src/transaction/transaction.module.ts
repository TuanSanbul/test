import { Module } from '@nestjs/common';
import { DepositModule } from './deposit';
import { HistoryModule } from './history';
import { WithdrawalModule } from './withdrawal';

@Module({
  imports: [WithdrawalModule, DepositModule, HistoryModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class TransactionModule {}
