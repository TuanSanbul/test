import { BlackListType, ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { PaginationDTO } from '@lib/utils/validation-pipe';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  BlackListIpDto,
  CreateBlackListMemberDto,
  QueryBlackListDto,
} from './dto';

@Controller('black-list')
@ApiTags('Config Service')
@ApiBearerAuth()
export class BlackListController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(BlackListController.name, ServiceName.CONFIG_SERVICE);
  }

  @HttpCode(HttpStatus.OK)
  @Get('ip')
  getListIp() {
    const functionName = BlackListController.prototype.getListIp.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      {},
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('member/listing')
  getListMember(
    @Body() query: QueryBlackListDto,
    @Query() pagination: PaginationDTO,
  ) {
    const functionName = BlackListController.prototype.getListMember.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = {
      payload: { type: BlackListType.Member, ...query, ...pagination },
    };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('ip/add')
  addIpAddress(@Body() payload: BlackListIpDto) {
    const functionName = BlackListController.prototype.addIpAddress.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('ip/remove')
  deleteIpAddress(@Body() payload: BlackListIpDto) {
    const functionName = BlackListController.prototype.deleteIpAddress.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('member/add')
  addMember(@Body() payload: CreateBlackListMemberDto) {
    const functionName = BlackListController.prototype.addMember.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('remove/:id')
  deleteMember(@Param('id') id: string) {
    const functionName = BlackListController.prototype.deleteMember.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = { id };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }
}
