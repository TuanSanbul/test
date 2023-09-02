import { MultipleDeleteDto, PaginateDto, TimerDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import { ICustomRequest, IQueryMessage } from '@lib/common/interfaces/request';
import { IMessage, IPatternMessage } from '@lib/common/interfaces/services';
import { BaseGatewayController } from '@lib/core/base';
import { Communicate } from '@lib/core/databases/postgres';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateNotificationDto,
  QueryNotificationDto,
  UpdateNotificationDto,
} from './dto';

@Controller('communicate/notification')
@ApiTags('Communicate Service')
@ApiBearerAuth()
export class NotificationController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(NotificationController.name, ServiceName.COMMUNICATE_SERVICE);
  }

  @Post('create')
  async createNotification(
    @Req() request: ICustomRequest,
    @Body() payload: CreateNotificationDto,
  ) {
    const ipAddress = request.connection.remoteAddress.split(':').pop();

    const functionName =
      NotificationController.prototype.createNotification.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { payload: Object.assign(payload, { ipAddress }) };

    return this.serviceClient.sendMessage(
      ServiceName.COMMUNICATE_SERVICE,
      message,
      pattern,
    );
  }

  @Post('update/:id')
  async updateNotification(
    @Param('id') id: string,
    @Body() payload: UpdateNotificationDto,
  ) {
    const functionName =
      NotificationController.prototype.updateNotification.name;
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
  async getOneById(@Query() query: PaginateDto, @Param('id') id: string) {
    const functionName = NotificationController.prototype.getOneById.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { payload: Object.assign(query, { id }) };

    return this.serviceClient.sendMessage(
      ServiceName.COMMUNICATE_SERVICE,
      message,
      pattern,
    );
  }

  @Post('listing')
  async getList(
    @Query() query: TimerDto,
    @Body() payload: QueryNotificationDto,
  ) {
    const functionName = NotificationController.prototype.getList.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage<IQueryMessage<Communicate>> = {
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
  async softDeleteNotification(@Body() payload: MultipleDeleteDto) {
    const functionName =
      NotificationController.prototype.softDeleteNotification.name;
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
