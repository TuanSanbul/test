import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { OrderListingModule } from './listing';
import { OrderServiceController } from './order-service.controller';
import { OrderModule } from './service';

const Modules = [OrderModule, OrderListingModule];

@Module({
  imports: [ServiceProviderModule, ...Modules],
  controllers: [OrderServiceController],
})
export class OrderServiceModule {}
