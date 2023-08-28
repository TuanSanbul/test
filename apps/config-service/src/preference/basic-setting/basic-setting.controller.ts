import { ServiceName } from '@lib/common/enums';
import { IMessage, IMutationResponse } from '@lib/common/interfaces';
import {
  IListDepositConfig,
  IMainConfig,
  IMemberConfig,
  INoticeConfig,
  ISiteSettings,
} from '@lib/common/interfaces/modules/preference';
import { ResponseResult } from '@lib/common/types';
import { MainConfig, NoticeConfig } from '@lib/core/databases/mongo';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { BasicSettingService } from './basic-setting.service';

@Controller()
@ApiTags('Config Service')
export class BasicSettingController {
  static prefixCmd = [ServiceName.CONFIG_SERVICE, BasicSettingController.name];
  constructor(private readonly basicSettingService: BasicSettingService) {}

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.getBasicSetting.name,
    ),
  })
  getBasicSetting(message: IMessage) {
    const { id } = message;
    return this.basicSettingService.getBasicSetting(id);
  }

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.updateDeposit.name,
    ),
  })
  updateDeposit(message: IMessage<IListDepositConfig>) {
    const { payload } = message;

    return this.basicSettingService.updateDeposit(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.updateNotice.name,
    ),
  })
  updateNotice(message: IMessage<INoticeConfig>) {
    const { payload } = message;
    return this.basicSettingService.updateNotice(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.updateMember.name,
    ),
  })
  updateMember(message: IMessage<IMemberConfig>) {
    const { payload } = message;
    return this.basicSettingService.updateMember(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.updateSite.name,
    ),
  })
  updateSite(message: IMessage<ISiteSettings>) {
    const { payload } = message;
    return this.basicSettingService.updateSite(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.createMemberConfig.name,
    ),
  })
  createMemberConfig(message: IMessage<IMemberConfig>) {
    const { payload } = message;

    return this.basicSettingService.createMemberConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.createNoticeConfig.name,
    ),
  })
  createNoticeConfig(
    message: IMessage<INoticeConfig>,
  ): Promise<ResponseResult<NoticeConfig>> {
    const { payload } = message;

    return this.basicSettingService.createNoticeConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.createMainConfig.name,
    ),
  })
  createMainConfig(
    message: IMessage<IMainConfig>,
  ): Promise<ResponseResult<MainConfig>> {
    const { payload } = message;
    return this.basicSettingService.createMainConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.createDepositConfig.name,
    ),
  })
  createDepositConfig(
    message: IMessage<IListDepositConfig>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.basicSettingService.createDepositConfig(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      BasicSettingController.prefixCmd,
      BasicSettingController.prototype.getMemberConfig.name,
    ),
  })
  getMemberConfig() {
    return this.basicSettingService.getMemberConfig();
  }
}
