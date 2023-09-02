import { configuration } from '@lib/config/configuration';
import { ServiceProviderModule } from '@lib/core/message-handler';
import { HealthModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommunicateServiceController } from './communicate.controller';
import { NotificationModule } from './notification';
import { TemplateModule } from './template';
import { PostMessageModule } from './post-message';
import { ConnectionStatusModule } from './connection-status';

@Module({
  imports: [
    ServiceProviderModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    HealthModule,
    NotificationModule,
    TemplateModule,
    PostMessageModule,
    ConnectionStatusModule,
  ],
  controllers: [CommunicateServiceController],
})
export class CommunicateServiceModule {}
