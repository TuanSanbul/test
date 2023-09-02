import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { OrderListingController } from './order-listing.controller';

const Modules = [];

@Module({
  imports: [ServiceProviderModule, ...Modules],
  controllers: [OrderListingController],
})
export class OrderListingModule {}
