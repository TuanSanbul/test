import { BonusSettingController } from './bonus-setting.controller';
import { BonusSettingService } from './bonus-setting.service';

import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { mapEntities } from '@lib/utils/helpers';
import {
  AttendanceBonus,
  AttendanceBonusSchema,
  BulletinBonus,
  BulletinBonusSchema,
  ComboBonus,
  ComboBonusSchema,
  CommentBonus,
  CommentBonusSchema,
  GameConfig,
  GameConfigSchema,
  LevelRate,
  LevelRateSchema,
  MainConfig,
  MainConfigSchema,
  RechargeBonus,
  RechargeBonusItem,
  RechargeBonusItemSchema,
  RechargeBonusSchema,
} from '@lib/core/databases/mongo';

const entities: IEntitiesMapMetadata = {
  [DbName.Mongo]: [
    { name: LevelRate.name, schema: LevelRateSchema },
    { name: GameConfig.name, schema: GameConfigSchema },
    { name: ComboBonus.name, schema: ComboBonusSchema },
    { name: AttendanceBonus.name, schema: AttendanceBonusSchema },
    { name: BulletinBonus.name, schema: BulletinBonusSchema },
    { name: MainConfig.name, schema: MainConfigSchema },
    { name: CommentBonus.name, schema: CommentBonusSchema },
    { name: RechargeBonusItem.name, schema: RechargeBonusItemSchema },
    {
      name: RechargeBonus.name,
      schema: RechargeBonusSchema,
    },
  ],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [BonusSettingController],
  providers: [BonusSettingService],
})
export class BonusSettingModule {}
