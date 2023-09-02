import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { TimeFilterDto } from '@lib/utils/validation-pipe';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryBodyGameDetail, QueryNewsFeedDto } from './dto';

@Controller('game')
@ApiTags('Game Service')
@ApiBearerAuth()
export class NewsFeedController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(NewsFeedController.name, ServiceName.GAME_SERVICE);
  }

  @HttpCode(HttpStatus.OK)
  @Post('listing')
  getListFeeds(@Body() body: QueryNewsFeedDto, @Query() query: TimeFilterDto) {
    const functionName = NewsFeedController.prototype.getListFeeds.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = {
      payload: Object.assign(query, body),
    };

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('detail')
  getDetailFeed(@Body() payload: QueryBodyGameDetail) {
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
