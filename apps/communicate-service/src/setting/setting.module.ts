import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import {
  CommunicateSetting,
  CommunicateSettingSchema,
} from '@lib/core/databases/mongo';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { NotificationSettingService } from './setting.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Mongo]: [
    { name: CommunicateSetting.name, schema: CommunicateSettingSchema },
  ],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  providers: [NotificationSettingService],
  exports: [NotificationSettingService],
})
export class NotificationSettingModule {}
