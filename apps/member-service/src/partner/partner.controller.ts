import { ServiceName } from '@lib/common/enums';
import { IMessage } from '@lib/common/interfaces';
import { PartnerLog } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PartnerService } from './partner.service';

@Controller()
export class PartnerController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, PartnerController.name];
  constructor(private readonly partnerService: PartnerService) {}

  @MessagePattern({
    cmd: getPattern(
      PartnerController.prefixCmd,
      PartnerController.prototype.getList.name,
    ),
  })
  getList() {
    return this.partnerService.getListPartnerType();
  }

  @MessagePattern({
    cmd: getPattern(
      PartnerController.prefixCmd,
      PartnerController.prototype.getPartnerSettlement.name,
    ),
  })
  getPartnerSettlement(message: IMessage) {
    return this.partnerService.getPartnerSettlement(message.payload);
  }

  @MessagePattern({
    cmd: getPattern(
      PartnerController.prefixCmd,
      PartnerController.prototype.getListPartnerType.name,
    ),
  })
  getListPartnerType() {
    return this.partnerService.getListPartnerType();
  }

  @MessagePattern({
    cmd: getPattern(
      PartnerController.prefixCmd,
      PartnerController.prototype.setPartnerConfig.name,
    ),
  })
  setPartnerConfig(message: IMessage<PartnerLog>) {
    return this.partnerService.setPartnerConfig(message.payload);
  }
}
