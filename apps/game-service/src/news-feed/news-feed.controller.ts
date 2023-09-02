import { ServiceName } from '@lib/common/enums';
import { IMessage, IQueryMessage } from '@lib/common/interfaces';
import { IQueryGameDetail } from '@lib/common/interfaces/modules/game';
import { GameDetail, GameFeed } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NewsFeedService } from './news-feed.service';

@Controller()
export class NewsFeedController {
  static prefixCmd = [ServiceName.GAME_SERVICE, NewsFeedController.name];

  constructor(private readonly newsFeedService: NewsFeedService) {}

  @MessagePattern({
    cmd: getPattern(
      NewsFeedController.prefixCmd,
      NewsFeedController.prototype.getListFeeds.name,
    ),
  })
  async getListFeeds(message: IMessage<IQueryMessage<GameFeed & GameDetail>>) {
    return this.newsFeedService.getListFeeds(message.payload);
  }

  @MessagePattern({
    cmd: getPattern(
      NewsFeedController.prefixCmd,
      NewsFeedController.prototype.getDetailFeed.name,
    ),
  })
  async getDetailFeed(message: IMessage<IQueryGameDetail>) {
    return this.newsFeedService.getDetailFeed(message.payload);
  }
}
