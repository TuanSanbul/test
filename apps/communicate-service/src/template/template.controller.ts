import { ServiceName } from '@lib/common/enums';
import { IQueryMessage } from '@lib/common/interfaces';
import {
  IMutationResponse,
  IPaginationResponse,
} from '@lib/common/interfaces/response';
import { IMessage } from '@lib/common/interfaces/services';
import { ResponseResult } from '@lib/common/types';
import {
  CommunicateTemplate,
  ICommunicateTemplate,
} from '@lib/core/databases/mongo';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { TemplateService } from './template.service';

@Controller()
export class TemplateController {
  static prefixCmd = [ServiceName.COMMUNICATE_SERVICE, TemplateController.name];
  constructor(private readonly templateService: TemplateService) {}

  @MessagePattern({
    cmd: getPattern(
      TemplateController.prefixCmd,
      TemplateController.prototype.createTemplate.name,
    ),
  })
  createTemplate(
    message: IMessage<ICommunicateTemplate>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.templateService.createTemplate(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      TemplateController.prefixCmd,
      TemplateController.prototype.updateTemplate.name,
    ),
  })
  updateTemplate(
    message: IMessage<ICommunicateTemplate>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { id, payload } = message;
    return this.templateService.updateTemplate(id, payload);
  }

  @MessagePattern({
    cmd: getPattern(
      TemplateController.prefixCmd,
      TemplateController.prototype.getOneTemplate.name,
    ),
  })
  getOneTemplate(
    message: IMessage,
  ): Promise<ResponseResult<CommunicateTemplate>> {
    const { id } = message;
    return this.templateService.getOneTemplate(id);
  }

  @MessagePattern({
    cmd: getPattern(
      TemplateController.prefixCmd,
      TemplateController.prototype.getListTemplate.name,
    ),
  })
  getListTemplate(
    message: IMessage<IQueryMessage<CommunicateTemplate>>,
  ): Promise<ResponseResult<IPaginationResponse<CommunicateTemplate>>> {
    const { payload } = message;
    return this.templateService.getListTemplate(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      TemplateController.prefixCmd,
      TemplateController.prototype.deleteTemplate.name,
    ),
  })
  deleteTemplate(
    message: IMessage,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { id } = message;
    return this.templateService.deleteTemplate(id);
  }
}
