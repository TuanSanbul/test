import { dbConfig } from '@lib/common/constants';
import { configuration } from '@lib/config/configuration';
import { DatabaseModule } from '@lib/core/databases';
import { HealthModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommunicateServiceController } from './communicate-service.controller';
import { NotificationModule } from './notification';
import { PostMessageModule } from './post-message';
import { TemplateModule } from './template';
import { ConnectionStatusModule } from './connection-status';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    HealthModule,
    ...DatabaseModule.register({
      dbConfig,
      getConfig: (cf) => (configService: ConfigService) => {
        const schemaDbConfig = configService.get(cf);
        return Object.assign(
          {},
          schemaDbConfig,
          schemaDbConfig?.replication?.master,
        );
      },
    }),
    NotificationModule,
    TemplateModule,
    PostMessageModule,
    ConnectionStatusModule,
  ],
  controllers: [CommunicateServiceController],
})
export class CommunicateServiceModule {}
