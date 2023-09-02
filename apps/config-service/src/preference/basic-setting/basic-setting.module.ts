import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { BasicSettingController } from './basic-setting.controller';
import { BasicSettingService } from './basic-setting.service';
import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { mapEntities } from '@lib/utils/helpers';
import {
  DepositConfig,
  DepositConfigSchema,
  MainConfig,
  MainConfigSchema,
  MemberConfig,
  MemberConfigSchema,
  NoticeConfig,
  NoticeConfigSchema,
} from '@lib/core/databases/mongo';

const entities: IEntitiesMapMetadata = {
  [DbName.Mongo]: [
    { name: MainConfig.name, schema: MainConfigSchema },
    {
      name: MemberConfig.name,
      schema: MemberConfigSchema,
    },
    {
      name: DepositConfig.name,
      schema: DepositConfigSchema,
    },
    {
      name: NoticeConfig.name,
      schema: NoticeConfigSchema,
    },
  ],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [BasicSettingController],
  providers: [BasicSettingService],
})
export class BasicSettingModule {}
