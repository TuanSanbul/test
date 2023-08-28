import { ServiceProviderModule } from '@lib/core/message-handler';
import { MarketController } from './market.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [ServiceProviderModule],
  controllers: [MarketController],
  providers: [],
})
export class MarketModule {}
