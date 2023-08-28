import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import {
  BankCheck,
  Deposit,
  Member,
  MoneyLog,
  Withdrawal,
} from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { MoneyModule } from '../../money';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalService } from './withdrawal.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [Member, Deposit, BankCheck, MoneyLog, Withdrawal],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities), MoneyModule],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
  exports: [],
})
export class WithdrawalModule {}
