import { ServiceProviderModule } from '@lib/core/message-handler';

import { Module } from '@nestjs/common';
import { WithdrawalController } from './withdrawal.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [WithdrawalController],
  providers: [],
})
export class WithdrawalModule {}
