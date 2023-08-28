import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { GameConfigController } from './game-config.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [GameConfigController],
})
export class GameConfigModule {}
