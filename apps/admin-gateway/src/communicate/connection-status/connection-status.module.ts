import { Module } from '@nestjs/common';
import { ConnectionStatusController } from './connection-status.controller';
import { ServiceProviderModule } from '@lib/core/message-handler';

@Module({
  imports: [ServiceProviderModule],
  controllers: [ConnectionStatusController],
})
export class ConnectionStatusModule {}
