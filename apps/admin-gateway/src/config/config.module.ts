import { Module } from '@nestjs/common';
import { PreferenceModule } from './preference';
import { BlackListModule } from './black-list';
import { MarketModule } from './market';
import { ConfigController } from './config.controller';
import { GameConfigModule } from './game-config';

@Module({
  imports: [PreferenceModule, BlackListModule, MarketModule, GameConfigModule],
  controllers: [ConfigController],
})
export class ConfigServiceModule {}
