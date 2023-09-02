import { Module } from '@nestjs/common';
import { DepositModule } from './deposit';

@Module({
  imports: [DepositModule],
})
export class CalculateServiceModule {}
