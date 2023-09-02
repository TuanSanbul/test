import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import * as mongo from '@lib/core/databases/mongo';
import { Role } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { MainConfigService } from './main-config.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Mongo]: [
    { name: mongo.LevelRate.name, schema: mongo.LevelRateSchema },
    { name: mongo.GameConfig.name, schema: mongo.GameConfigSchema },
    { name: mongo.ComboBonus.name, schema: mongo.ComboBonusSchema },
    { name: mongo.AttendanceBonus.name, schema: mongo.AttendanceBonusSchema },
    { name: mongo.BulletinBonus.name, schema: mongo.BulletinBonusSchema },
    { name: mongo.Bank.name, schema: mongo.BankSchema },
    { name: mongo.CommentBonus.name, schema: mongo.CommentBonusSchema },
    { name: mongo.DepositConfig.name, schema: mongo.DepositConfigSchema },
    {
      name: mongo.RechargeBonus.name,
      schema: mongo.RechargeBonusSchema,
    },
    {
      name: mongo.RechargeBonusItem.name,
      schema: mongo.RechargeBonusItemSchema,
    },
  ],
  [DbName.Postgres]: [Role],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [],
  providers: [MainConfigService],
})
export class MainConfigModule {}
