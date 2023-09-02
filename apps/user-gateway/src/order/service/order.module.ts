import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [OrderController],
})
export class OrderModule {}
