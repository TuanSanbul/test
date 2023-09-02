import { Module } from '@nestjs/common';
import { NewsFeedModule } from './news-feed';
import { ServiceProviderModule } from '@lib/core/message-handler';
import { GameController } from './game.controller';

@Module({
  imports: [ServiceProviderModule, NewsFeedModule],
  controllers: [GameController],
  providers: [],
})
export class GameServiceModule {}
