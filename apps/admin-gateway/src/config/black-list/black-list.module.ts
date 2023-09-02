import { ServiceProviderModule } from '@lib/core/message-handler';
import { BlackListController } from './black-list.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [ServiceProviderModule],
  controllers: [BlackListController],
  providers: [],
})
export class BlackListModule {}
