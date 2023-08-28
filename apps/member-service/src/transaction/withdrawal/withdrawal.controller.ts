import { ServiceName } from '@lib/common/enums';
import {
  IMessage,
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import { IQueryFieldWithdraw } from '@lib/common/interfaces/modules/deposit';
import {
  ICreateWithdrawal,
  IRejectWithdrawal,
} from '@lib/common/interfaces/modules/withdrawal';
import { ResponseResult } from '@lib/common/types';
import { Withdrawal } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WithdrawalService } from './withdrawal.service';

@Controller()
export class WithdrawalController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, WithdrawalController.name];
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @MessagePattern({
    cmd: getPattern(
      WithdrawalController.prefixCmd,
      WithdrawalController.prototype.getListWithdrawal.name,
    ),
  })
  getListWithdrawal(
    message: IMessage<IQueryMessage<IQueryFieldWithdraw>>,
  ): Promise<ResponseResult<IPaginationResponse<Withdrawal>>> {
    const { payload } = message;
    return this.withdrawalService.getListWithdrawal(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      WithdrawalController.prefixCmd,
      WithdrawalController.prototype.createWithdrawal.name,
    ),
  })
  createWithdrawal(
    message: IMessage<ICreateWithdrawal>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.withdrawalService.createWithdrawal(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      WithdrawalController.prefixCmd,
      WithdrawalController.prototype.getListIpWithdrawal.name,
    ),
  })
  getListIpWithdrawal(
    message: IMessage<IQueryMessage<Withdrawal>>,
  ): Promise<ResponseResult<IPaginationResponse<Withdrawal>>> {
    const { payload } = message;
    return this.withdrawalService.getListIpWithdrawal(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      WithdrawalController.prefixCmd,
      WithdrawalController.prototype.approveWithdrawal.name,
    ),
  })
  approveWithdrawal(
    message: IMessage,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { id } = message;
    return this.withdrawalService.approveWithdrawal(id);
  }

  @MessagePattern({
    cmd: getPattern(
      WithdrawalController.prefixCmd,
      WithdrawalController.prototype.rejectWithdrawal.name,
    ),
  })
  rejectWithdrawal(
    message: IMessage<IRejectWithdrawal>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.withdrawalService.rejectWithdrawal(payload);
  }
}
