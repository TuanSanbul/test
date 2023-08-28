import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';

const Modules = [];

@Module({
  imports: [ServiceProviderModule, ...Modules],
  controllers: [OrderController],
})
export class OrderModule {}
