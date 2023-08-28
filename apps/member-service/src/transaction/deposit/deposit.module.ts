import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import {
  BankCheck,
  Deposit,
  Member,
  Withdrawal,
} from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { MoneyModule } from '../../money';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [Member, Deposit, BankCheck, Withdrawal],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities), MoneyModule],
  controllers: [DepositController],
  providers: [DepositService],
  exports: [],
})
export class DepositModule {}
