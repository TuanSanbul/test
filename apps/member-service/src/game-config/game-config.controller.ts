import { ServiceName } from '@lib/common/enums';
import { IMessage } from '@lib/common/interfaces';
import {
  IPayloadMemberGameType,
  IPayloadUpdateMemberGameConfig,
} from '@lib/common/interfaces/modules/member';
import { Member } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GameConfigService } from './game-config.service';

@Controller()
export class GameConfigController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, GameConfigController.name];
  constructor(private readonly gameConfigService: GameConfigService) {}

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.getGameConfig.name,
    ),
  })
  getGameConfig(message: IMessage) {
    const { id } = message;
    return this.gameConfigService.getGameConfig(id);
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.createGameTypeConfig.name,
    ),
  })
  createGameTypeConfig(message: IMessage<IPayloadMemberGameType>) {
    const { payload } = message;
    return this.gameConfigService.createGameTypeConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.initGameConfig.name,
    ),
  })
  initGameConfig(message: IMessage<Member>) {
    const { payload } = message;
    return this.gameConfigService.initGameConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.initGameTypes.name,
    ),
  })
  initGameTypes(message: IMessage<Member>) {
    const { payload } = message;
    return this.gameConfigService.initGameTypes(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      GameConfigController.prefixCmd,
      GameConfigController.prototype.updateMemberGameConfig.name,
    ),
  })
  updateMemberGameConfig(message: IMessage<IPayloadUpdateMemberGameConfig>) {
    const { id, payload } = message;
    return this.gameConfigService.updateMemberGameConfig(id, payload);
  }
}
