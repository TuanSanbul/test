import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateGameCategory,
  CreateGameConfigDto,
  ListGameAmountDto,
  UpdateGameConfigDto,
} from './dto';

@Controller('game-config')
@ApiTags('Config Service')
@ApiBearerAuth()
export class GameConfigController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(GameConfigController.name, ServiceName.CONFIG_SERVICE);
  }

  @Get()
  getGameConfig() {
    const functionName = GameConfigController.prototype.getGameConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      {},
      pattern,
    );
  }

  @Post('update')
  updateGameConfig(@Body() payload: UpdateGameConfigDto) {
    const functionName = GameConfigController.prototype.updateGameConfig.name;
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

  @Get('categories')
  getGameCategories() {
    const functionName = GameConfigController.prototype.getGameCategories.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      {},
      pattern,
    );
  }

  @Post('create')
  createGameConfig(@Body() payload: CreateGameConfigDto) {
    const functionName = GameConfigController.prototype.createGameConfig.name;
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

  @Post('category/create')
  createGameCategory(@Body() body: CreateGameCategory) {
    const functionName = GameConfigController.prototype.createGameCategory.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload: body.name };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @Get('amount')
  getGameAmountConfig() {
    const functionName =
      GameConfigController.prototype.getGameAmountConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      {},
      pattern,
    );
  }

  @Post('amount/update')
  updateGameAmountConfig(@Body() body: ListGameAmountDto) {
    const functionName =
      GameConfigController.prototype.updateGameAmountConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload: body.data };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }
}
