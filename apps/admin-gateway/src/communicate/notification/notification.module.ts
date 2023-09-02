import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { ServiceProviderModule } from '@lib/core/message-handler';

@Module({
  imports: [ServiceProviderModule],
  controllers: [NotificationController],
})
export class NotificationModule {}
