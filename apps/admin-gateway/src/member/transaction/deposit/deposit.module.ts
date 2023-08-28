import { ServiceProviderModule } from '@lib/core/message-handler';

import { Module } from '@nestjs/common';
import { DepositController } from './deposit.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [DepositController],
  providers: [],
})
export class DepositModule {}
