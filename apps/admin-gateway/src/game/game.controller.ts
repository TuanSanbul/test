import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('game')
@ApiTags('Game Service')
@ApiBearerAuth()
export class GameController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(GameController.name, ServiceName.GAME_SERVICE);
  }

  @Get('sports')
  async getSports() {
    const functionName = GameController.prototype.getSports.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      {},
      pattern,
    );
  }

  @Get('leagues')
  async getLeagues() {
    const functionName = GameController.prototype.getLeagues.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      {},
      pattern,
    );
  }

  @Get('teams')
  async getTeams() {
    const functionName = GameController.prototype.getTeams.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      {},
      pattern,
    );
  }

  @Get('nations')
  async getNations() {
    const functionName = GameController.prototype.getNations.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    return this.serviceClient.sendMessage(
      ServiceName.GAME_SERVICE,
      {},
      pattern,
    );
  }
}
