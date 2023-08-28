import { MultipleDeleteDto, PaginateDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { IQueryPostMessage } from '@lib/common/interfaces/modules/communicate';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMessageDto, QueryMessageDto, UpdateMessageDto } from './dto';

@Controller('communicate/post-message')
@ApiTags('Communicate Service')
@ApiBearerAuth()
export class PostMessageController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(PostMessageController.name, ServiceName.COMMUNICATE_SERVICE);
  }

  @Post('create')
  async createMessage(@Body() payload: CreateMessageDto) {
    const functionName = PostMessageController.prototype.createMessage.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.COMMUNICATE_SERVICE,
      message,
      pattern,
    );
  }

  @Post('update/:id')
  async updateMessage(
    @Param('id') id: string,
    @Body() payload: UpdateMessageDto,
  ) {
    const functionName = PostMessageController.prototype.updateMessage.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = { id, payload };

    return this.serviceClient.sendMessage(
      ServiceName.COMMUNICATE_SERVICE,
      message,
      pattern,
    );
  }

  @Get(':id')
  async getOneMessage(@Param('id') id: string) {
    const functionName = PostMessageController.prototype.getOneMessage.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { id };

    return this.serviceClient.sendMessage(
      ServiceName.COMMUNICATE_SERVICE,
      message,
      pattern,
    );
  }

  @Post('listing')
  async getListMessage(
    @Query() query: PaginateDto,
    @Body() payload: QueryMessageDto,
  ) {
    const functionName = PostMessageController.prototype.getListMessage.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage<IQueryPostMessage> = {
      payload: {
        ...query,
        ...payload,
      },
    };

    return this.serviceClient.sendMessage(
      ServiceName.COMMUNICATE_SERVICE,
      message,
      pattern,
    );
  }

  @Post('delete')
  async deleteMessage(@Body() payload: MultipleDeleteDto) {
    const functionName = PostMessageController.prototype.deleteMessage.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.COMMUNICATE_SERVICE,
      message,
      pattern,
    );
  }
}
