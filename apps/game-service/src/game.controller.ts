import { ServiceName } from '@lib/common/enums';
import { IMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { GameFeed } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { GameService } from './game.service';

@ApiTags('Game Service')
@Controller()
export class GameController extends BaseGatewayController {
  static prefixCmd = [ServiceName.GAME_SERVICE, GameController.name];

  constructor(private readonly gameService: GameService) {
    super(GameController.name, ServiceName.GAME_SERVICE);
  }

  @MessagePattern({
    cmd: getPattern(
      GameController.prefixCmd,
      GameController.prototype.getTopLeagues.name,
    ),
  })
  async getTopLeagues() {
    return this.gameService.getTopLeagues();
  }

  @MessagePattern({
    cmd: getPattern(
      GameController.prefixCmd,
      GameController.prototype.getNations.name,
    ),
  })
  async getNations() {
    return this.gameService.getNations();
  }

  @MessagePattern({
    cmd: getPattern(
      GameController.prefixCmd,
      GameController.prototype.getTeams.name,
    ),
  })
  async getTeams() {
    return this.gameService.getTeams();
  }

  @MessagePattern({
    cmd: getPattern(
      GameController.prefixCmd,
      GameController.prototype.getLeagues.name,
    ),
  })
  async getLeagues() {
    return this.gameService.getLeagues();
  }

  @MessagePattern({
    cmd: getPattern(
      GameController.prefixCmd,
      GameController.prototype.getSports.name,
    ),
  })
  async getSports() {
    return this.gameService.getSports();
  }

  @MessagePattern({
    cmd: getPattern(
      GameController.prefixCmd,
      GameController.prototype.getTreeMenu.name,
    ),
  })
  async getTreeMenu(message: IMessage<GameFeed>) {
    return this.gameService.getTreeMenu(message.searchTerm);
  }

  @MessagePattern({
    cmd: getPattern(
      GameController.prefixCmd,
      GameController.prototype.getGameDetail.name,
    ),
  })
  async getGameDetail(message: IMessage<{ ids: string[] }>) {
    const { ids = [] } = message.payload;
    return this.gameService.getGameDetail(ids);
  }
}
