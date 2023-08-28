import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { OrderServiceController } from './order-service.controller';
import { OrderModule } from './service';

const Modules = [OrderModule];

@Module({
  imports: [ServiceProviderModule, ...Modules],
  controllers: [OrderServiceController],
})
export class OrderServiceModule {}
