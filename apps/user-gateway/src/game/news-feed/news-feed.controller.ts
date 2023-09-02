import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { TimeFilterDto } from '@lib/utils/validation-pipe';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryBodyGameDetail, QueryBodyNewsFeed } from './dto';

@ApiTags('Game Service')
@Controller('news-feed')
@ApiBearerAuth()
export class NewsFeedController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(NewsFeedController.name, ServiceName.GAME_SERVICE);
  }

  @Post('listing')
  async getListFeeds(
    @Query() query: TimeFilterDto,
    @Body() payload: QueryBodyNewsFeed,
  ) {
    const functionName = NewsFeedController.prototype.getListFeeds.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = {
      payload: Object.assign(payload, query),
    };
    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      message,
      pattern,
    );
  }

  @Post('detail')
  async getDetailFeed(@Body() payload: QueryBodyGameDetail) {
    const functionName = NewsFeedController.prototype.getDetailFeed.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = { payload };
    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      message,
      pattern,
    );
  }
}
