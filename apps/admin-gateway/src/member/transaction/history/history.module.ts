import { ServiceProviderModule } from '@lib/core/message-handler';

import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [HistoryController],
  providers: [],
})
export class HistoryModule {}
