import { ServiceName } from '@lib/common/enums';
import {
  IMessage,
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import { ResponseResult } from '@lib/common/types';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RegisterCodeService } from './register-code.service';
import { IRegisterCode } from '@lib/common/interfaces/modules/register-code';
import { RegisterCode } from '@lib/core/databases/postgres';

@Controller()
export class RegisterCodeController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, RegisterCodeController.name];
  constructor(private readonly registerCodeService: RegisterCodeService) {}

  @MessagePattern({
    cmd: getPattern(
      RegisterCodeController.prefixCmd,
      RegisterCodeController.prototype.updateRegisterCode.name,
    ),
  })
  updateRegisterCode(
    message: IMessage<IRegisterCode>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { id, payload } = message;
    return this.registerCodeService.updateRegisterCode(id, payload);
  }

  @MessagePattern({
    cmd: getPattern(
      RegisterCodeController.prefixCmd,
      RegisterCodeController.prototype.createRegisterCode.name,
    ),
  })
  createRegisterCode(
    message: IMessage<IRegisterCode>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.registerCodeService.createRegisterCode(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      RegisterCodeController.prefixCmd,
      RegisterCodeController.prototype.getListRegisterCode.name,
    ),
  })
  getListRegisterCode(
    message: IMessage<IQueryMessage<IRegisterCode>>,
  ): Promise<ResponseResult<IPaginationResponse<RegisterCode>>> {
    const { payload } = message;
    return this.registerCodeService.getListRegisterCode(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      RegisterCodeController.prefixCmd,
      RegisterCodeController.prototype.getRegisterCodeById.name,
    ),
  })
  getRegisterCodeById(
    message: IMessage,
  ): Promise<ResponseResult<RegisterCode>> {
    const { id } = message;
    return this.registerCodeService.getRegisterCodeById(id);
  }

  @MessagePattern({
    cmd: getPattern(
      RegisterCodeController.prefixCmd,
      RegisterCodeController.prototype.deleteRegisterCode.name,
    ),
  })
  deleteRegisterCode(
    message: IMessage,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { id } = message;
    return this.registerCodeService.deleteRegisterCode(id);
  }

  @MessagePattern({
    cmd: getPattern(
      RegisterCodeController.prefixCmd,
      RegisterCodeController.prototype.checkExistCode.name,
    ),
  })
  checkExistCode(
    message: IMessage<string>,
  ): Promise<ResponseResult<RegisterCode>> {
    const { payload } = message;
    return this.registerCodeService.checkExistCode(payload);
  }
}
