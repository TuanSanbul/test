import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { LoginLog, LoginLogSchema } from '@lib/core/databases/mongo';
import { ServiceProviderModule } from '@lib/core/message-handler';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConnectionStatusController } from './connection-status.controller';
import { ConnectionStatusService } from './connection-status.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Mongo]: [{ name: LoginLog.name, schema: LoginLogSchema }],
};

@Module({
  imports: [LoggerModule, ServiceProviderModule, ...mapEntities(entities)],
  controllers: [ConnectionStatusController],
  providers: [ConnectionStatusService],
})
export class ConnectionStatusModule {}
