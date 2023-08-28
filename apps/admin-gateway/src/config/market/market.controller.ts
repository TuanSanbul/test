import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { PaginationDTO } from '@lib/utils/validation-pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateMarketDto,
  QueryMarketDto,
  UpdateListMarketDto,
  UpdateMarketDto,
} from './dto';

@Controller('market')
@ApiTags('Config Service')
@ApiBearerAuth()
export class MarketController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(MarketController.name, ServiceName.CONFIG_SERVICE);
  }

  @HttpCode(HttpStatus.OK)
  @Post('listing')
  getList(@Body() query: QueryMarketDto, @Query() pagination: PaginationDTO) {
    const functionName = MarketController.prototype.getList.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = {
      payload: Object.assign(query, pagination),
    };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('config')
  getMarketConfig() {
    const functionName = MarketController.prototype.getMarketConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      {},
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getDetail(@Param('id') id: string) {
    const functionName = MarketController.prototype.getDetail.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = { id };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('create')
  createMarket(@Body() payload: CreateMarketDto) {
    const functionName = MarketController.prototype.createMarket.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('update')
  updateMarket(@Body() payload: UpdateMarketDto) {
    const functionName = MarketController.prototype.updateMarket.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('update-markets')
  updateListMarket(@Body() payload: UpdateListMarketDto) {
    const functionName = MarketController.prototype.updateListMarket.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }
}
