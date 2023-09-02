import { ServiceName } from '@lib/common/enums';
import {
  IMessage,
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import {
  IApproveDeposit,
  IQueryFieldDeposit,
  IRemoveBankCheck,
} from '@lib/common/interfaces/modules/deposit';
import { ResponseResult } from '@lib/common/types';
import { BankCheck, Deposit } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DepositService } from './deposit.service';

@Controller()
export class DepositController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, DepositController.name];
  constructor(private readonly depositService: DepositService) {}

  @MessagePattern({
    cmd: getPattern(
      DepositController.prefixCmd,
      DepositController.prototype.getListDeposit.name,
    ),
  })
  getListDeposit(message: IMessage<IQueryMessage<IQueryFieldDeposit>>) {
    const { payload } = message;
    return this.depositService.getListDeposit(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      DepositController.prefixCmd,
      DepositController.prototype.getListIpDeposit.name,
    ),
  })
  getListIpDeposit(
    message: IMessage<IQueryMessage<Deposit>>,
  ): Promise<ResponseResult<IPaginationResponse<Deposit>>> {
    const { payload } = message;
    return this.depositService.getListIpDeposit(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      DepositController.prefixCmd,
      DepositController.prototype.getBankCheck.name,
    ),
  })
  getBankCheck(
    message: IMessage<IQueryMessage<BankCheck>>,
  ): Promise<ResponseResult<IPaginationResponse<BankCheck>>> {
    const { payload } = message;
    return this.depositService.getBankCheck(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      DepositController.prefixCmd,
      DepositController.prototype.removeBankCheck.name,
    ),
  })
  removeBankCheck(
    message: IMessage<IRemoveBankCheck>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.depositService.removeBankCheck(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      DepositController.prefixCmd,
      DepositController.prototype.approveDeposit.name,
    ),
  })
  approveDeposit(
    message: IMessage<IApproveDeposit>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    const { id, request } = payload;
    return this.depositService.approveDeposit(id, request);
  }

  @MessagePattern({
    cmd: getPattern(
      DepositController.prefixCmd,
      DepositController.prototype.rejectDeposit.name,
    ),
  })
  rejectDeposit(message: IMessage): Promise<ResponseResult<IMutationResponse>> {
    const { id } = message;
    return this.depositService.rejectDeposit(id);
  }
}
