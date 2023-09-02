import { ServiceName } from '@lib/common/enums';
import { IMessage } from '@lib/common/interfaces';
import {
  IAttendanceBonus,
  IBonus,
  IBulletinBonus,
  IComboBonus,
  ICommentBonus,
  ICreateLevelRates,
  IListBonus,
  IListRechargeBonus,
  ILostBonus,
  IRechargeBonus,
  IUpdateAttendance,
  IUpdateBonusFolder,
} from '@lib/common/interfaces/modules/preference';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { BonusSettingService } from './bonus-setting.service';

@Controller()
@ApiTags('Config Service')
export class BonusSettingController {
  static prefixCmd = [ServiceName.CONFIG_SERVICE, BonusSettingController.name];
  constructor(private readonly bonusSettingService: BonusSettingService) {}

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.getBonusSetting.name,
    ),
  })
  getBonusSetting(message: IMessage) {
    const { id } = message;

    return this.bonusSettingService.getBonusSetting(id);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.updateGameBonus.name,
    ),
  })
  updateGameBonus(message: IMessage<ILostBonus>) {
    const { payload } = message;
    return this.bonusSettingService.updateGameBonus(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.getListRechargeBonus.name,
    ),
  })
  getListRechargeBonus(message: IMessage) {
    const { id } = message;
    return this.bonusSettingService.getListRechargeBonus(id);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.updateListRecharge.name,
    ),
  })
  updateListRecharge(message: IMessage<IListRechargeBonus>) {
    const { payload } = message;
    return this.bonusSettingService.updateListRecharge(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.updateBonusFolder.name,
    ),
  })
  updateBonusFolder(message: IMessage<IUpdateBonusFolder>) {
    const { payload } = message;
    return this.bonusSettingService.updateBonusFolder(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.createGameConfig.name,
    ),
  })
  createGameConfig(message: IMessage<Partial<IBonus>>) {
    const { payload } = message;

    return this.bonusSettingService.createGameConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.createLevelRates.name,
    ),
  })
  createLevelRates(message: IMessage<ICreateLevelRates>) {
    const { payload } = message;
    return this.bonusSettingService.createLevelRates(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.updateRecharge.name,
    ),
  })
  updateRecharge(message: IMessage<IRechargeBonus>) {
    const { payload } = message;

    return this.bonusSettingService.updateRecharge(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.createRechargeBonus.name,
    ),
  })
  createRechargeBonus(message: IMessage<Partial<IRechargeBonus>>) {
    const { payload } = message;
    return this.bonusSettingService.createRechargeBonus(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.createComboBonus.name,
    ),
  })
  createComboBonus(message: IMessage<IListBonus<IComboBonus>>) {
    const { payload } = message;
    const { data = [], mainConfigId } = payload;
    return this.bonusSettingService.createComboBonus(mainConfigId, data);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.createCommentBonus.name,
    ),
  })
  createCommentBonus(message: IMessage<IListBonus<ICommentBonus>>) {
    const { payload } = message;
    const { data = [], mainConfigId } = payload;
    return this.bonusSettingService.createCommentBonus(mainConfigId, data);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.createAttendanceBonus.name,
    ),
  })
  createAttendanceBonus(message: IMessage<IListBonus<IAttendanceBonus>>) {
    const { payload } = message;
    const { data = [], mainConfigId } = payload;
    return this.bonusSettingService.createAttendanceBonus(mainConfigId, data);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.createBulletinBonus.name,
    ),
  })
  createBulletinBonus(message: IMessage<IListBonus<IBulletinBonus>>) {
    const { payload } = message;
    const { data = [], mainConfigId } = payload;
    return this.bonusSettingService.createBulletinBonus(mainConfigId, data);
  }

  @MessagePattern({
    cmd: getPattern(
      BonusSettingController.prefixCmd,
      BonusSettingController.prototype.updateAttendance.name,
    ),
  })
  updateAttendance(message: IMessage<IUpdateAttendance>) {
    const { payload } = message;

    return this.bonusSettingService.updateAttendance(payload);
  }
}
