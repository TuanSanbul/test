import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { GameConfigController } from './game-config.controller';
import { GameConfigService } from './game-config.service';

@Module({
  imports: [LoggerModule],
  controllers: [GameConfigController],
  providers: [GameConfigService],
  exports: [GameConfigService],
})
export class GameConfigModule {}
