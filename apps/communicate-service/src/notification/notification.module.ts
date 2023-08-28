import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { getEntitiesPostgres, mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { NotificationSettingModule } from '../setting';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: getEntitiesPostgres(),
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities), NotificationSettingModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
