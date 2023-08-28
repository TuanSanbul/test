import { Module } from '@nestjs/common';
import { ServiceProviderModule } from '@lib/core/message-handler';
import { DepositController } from './deposit.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [DepositController],
})
export class DepositModule {}
