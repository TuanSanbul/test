import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { NewsFeedModule } from './news-feed';
import { GameController } from './game.controller';

const Modules = [NewsFeedModule];
@Module({
  imports: [ServiceProviderModule, ...Modules],
  controllers: [GameController],
})
export class GameServiceModule {}
