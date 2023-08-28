import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import * as mongo from '@lib/core/databases/mongo';
import { getEntitiesPostgres, mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: getEntitiesPostgres(),
  [DbName.Mongo]: [
    {
      name: mongo.RechargeBonus.name,
      schema: mongo.RechargeBonusSchema,
    },
    {
      name: mongo.RechargeBonusItem.name,
      schema: mongo.RechargeBonusItemSchema,
    },
  ],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [DepositController],
  providers: [DepositService],
  exports: [],
})
export class DepositModule {}
