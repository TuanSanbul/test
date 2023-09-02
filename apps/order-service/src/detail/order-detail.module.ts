import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';
import { TCPCallModule } from '../tcp-call';

@Module({
  imports: [LoggerModule, TCPCallModule],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService],
})
export class OrderDetailModule {}
