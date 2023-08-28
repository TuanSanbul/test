import { ServiceProviderModule } from '@lib/core/message-handler';
import { GameConfigController } from './game-config.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [ServiceProviderModule],
  controllers: [GameConfigController],
  providers: [],
})
export class GameConfigModule {}
