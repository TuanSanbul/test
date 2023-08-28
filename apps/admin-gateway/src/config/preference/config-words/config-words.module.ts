import { ServiceProviderModule } from '@lib/core/message-handler';
import { ConfigWordsController } from './config-words.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [ServiceProviderModule],
  controllers: [ConfigWordsController],
  providers: [],
})
export class ConfigWordsModule {}
