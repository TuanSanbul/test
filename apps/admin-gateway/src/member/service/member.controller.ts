import { UserDecorator } from '@lib/common/decorators';
import { PaginateDto, TimerDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateMemberDto,
  LogoutMemberDto,
  QueryMemberDto,
  QueryMemberIPDto,
  UpdateConfigMember,
  UpdateDetailMember,
  UpdateMultiMemberDto,
} from './dto';

@Controller('member')
@ApiTags('Member Service')
@ApiBearerAuth()
export class MemberController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(MemberController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('listing')
  async getList(@Query() query: TimerDto, @Body() payload: QueryMemberDto) {
    const functionName = MemberController.prototype.getList.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { payload: Object.assign(payload, query) };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @Post('listing-ip')
  async getListIP(
    @Query() query: PaginateDto,
    @Body() payload: QueryMemberIPDto,
  ) {
    const functionName = MemberController.prototype.getListIP.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { payload: Object.assign(payload, query) };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @Get('config/:id')
  async getMemberConfig(@Param('id') id: string) {
    const functionName = MemberController.prototype.getMemberConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { id };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @Get('detail/:id')
  async getDetailConfig(@Param('id') id: string) {
    const functionName = MemberController.prototype.getDetailConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { id };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @Post('update-members')
  async updateMultiMember(
    @UserDecorator() user: IJwtPayload,
    @Body() payload: UpdateMultiMemberDto,
  ) {
    const functionName = MemberController.prototype.updateMultiMember.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = {
      payload: Object.assign(payload, { actorLevel: user.memberLevel }),
    };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @Post('update-config/:id')
  async updateConfigMember(
    @Param('id') id: string,
    @Body() payload: UpdateConfigMember,
  ) {
    const functionName = MemberController.prototype.updateConfigMember.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { id, payload };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @Post('update-detail/:id')
  async updateDetailMember(
    @Param('id') id: string,
    @UserDecorator() user: IJwtPayload,
    @Body() payload: UpdateDetailMember,
  ) {
    const functionName = MemberController.prototype.updateDetailMember.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = {
      id,
      payload: Object.assign(payload, { actorLevel: user.memberLevel }),
    };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @Post('create')
  async createMember(@Body() payload: CreateMemberDto) {
    const functionName = MemberController.prototype.createMember.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { payload };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @Post('logout-member')
  async logoutMember(@Body() payload: LogoutMemberDto) {
    const functionName = MemberController.prototype.logoutMember.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { id: payload.memberId };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @Get('history/:id')
  async getHistory(@Param('id') id: string) {
    const functionName = MemberController.prototype.getHistory.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message = { id };

    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }
}
