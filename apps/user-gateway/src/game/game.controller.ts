import { Public } from '@lib/common/decorators';
import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SearchMenuDto } from './search-menu.dto';

@Controller()
@ApiTags('Game Service')
@Public()
export class GameController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(GameController.name, ServiceName.GAME_SERVICE);
  }

  @Get('top-leagues')
  async getTopLeagues() {
    const functionName = GameController.prototype.getTopLeagues.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      {},
      pattern,
    );
  }

  @Post('menu')
  async getTreeMenu(@Body() payload: SearchMenuDto) {
    const functionName = GameController.prototype.getTreeMenu.name;

    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = {
      searchTerm: payload.searchTerm,
    };

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      message,
      pattern,
    );
  }

  @Get('nations')
  async getNations() {
    const functionName = GameController.prototype.getNations.name;

    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = {};

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      message,
      pattern,
    );
  }

  @Get('leagues')
  async getLeagues() {
    const functionName = GameController.prototype.getLeagues.name;

    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = {};

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      message,
      pattern,
    );
  }

  @Get('teams')
  async getTeams() {
    const functionName = GameController.prototype.getTeams.name;

    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = {};

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      message,
      pattern,
    );
  }

  @Get('sports')
  async getSports() {
    const functionName = GameController.prototype.getSports.name;

    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = {};

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      message,
      pattern,
    );
  }
}
