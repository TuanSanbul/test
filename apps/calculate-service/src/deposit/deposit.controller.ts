import { ServiceName } from '@lib/common/enums';
import { IMessage, IMutationResponse } from '@lib/common/interfaces';
import { ICreateDeposit } from '@lib/common/interfaces/modules/deposit';
import { ResponseResult } from '@lib/common/types';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DepositService } from './deposit.service';

@Controller()
export class DepositController {
  static prefixCmd = [ServiceName.CALCULATE_SERVICE, DepositController.name];
  constructor(private readonly depositService: DepositService) {}

  @MessagePattern({
    cmd: getPattern(
      DepositController.prefixCmd,
      DepositController.prototype.createDeposit.name,
    ),
  })
  createDeposit(
    message: IMessage<ICreateDeposit>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.depositService.createDeposit(payload);
  }
}
