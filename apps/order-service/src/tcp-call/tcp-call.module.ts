import { ServiceProviderModule } from '@lib/core/message-handler';
import { LoggerModule } from '@lib/utils/modules';
import { Module, forwardRef } from '@nestjs/common';
import { OrderModule } from '../order';
import { TCPCallService } from './tcp-call.service';

@Module({
  imports: [LoggerModule, ServiceProviderModule, forwardRef(() => OrderModule)],
  providers: [TCPCallService],
  exports: [TCPCallService],
})
export class TCPCallModule {}
