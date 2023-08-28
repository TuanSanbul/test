import { ServiceName } from '@lib/common/enums';
import {
  ICreatePostMessage,
  IQueryPostMessage,
} from '@lib/common/interfaces/modules/communicate';
import {
  IMutationResponse,
  IPaginationResponse,
} from '@lib/common/interfaces/response';
import { IMessage } from '@lib/common/interfaces/services';
import { ResponseResult } from '@lib/common/types';
import { PostMessage } from '@lib/core/databases/postgres';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostMessageService } from './post-message.service';

@Controller()
export class PostMessageController {
  static prefixCmd = [
    ServiceName.COMMUNICATE_SERVICE,
    PostMessageController.name,
  ];
  constructor(private readonly postService: PostMessageService) {}

  @MessagePattern({
    cmd: getPattern(
      PostMessageController.prefixCmd,
      PostMessageController.prototype.createMessage.name,
    ),
  })
  createMessage(
    message: IMessage<ICreatePostMessage>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.postService.createMessage(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      PostMessageController.prefixCmd,
      PostMessageController.prototype.updateMessage.name,
    ),
  })
  updateMessage(
    message: IMessage<PostMessage>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { id, payload } = message;
    return this.postService.updateMessage(id, payload);
  }

  @MessagePattern({
    cmd: getPattern(
      PostMessageController.prefixCmd,
      PostMessageController.prototype.getOneMessage.name,
    ),
  })
  getOneMessage(message: IMessage): Promise<ResponseResult<PostMessage>> {
    const { id } = message;
    return this.postService.getOneMessage(id);
  }

  @MessagePattern({
    cmd: getPattern(
      PostMessageController.prefixCmd,
      PostMessageController.prototype.getListMessage.name,
    ),
  })
  getListMessage(
    message: IMessage<IQueryPostMessage>,
  ): Promise<ResponseResult<IPaginationResponse<PostMessage>>> {
    const { payload } = message;
    return this.postService.getListMessage(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      PostMessageController.prefixCmd,
      PostMessageController.prototype.deleteMessage.name,
    ),
  })
  deleteMessage(
    message: IMessage<{ ids: string[] }>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { ids } = message.payload;
    return this.postService.deleteMessage(ids);
  }
}
