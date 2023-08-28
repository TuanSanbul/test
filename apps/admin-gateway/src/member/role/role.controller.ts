import { TimerDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryRoleDto } from './dto';

@Controller('role')
@ApiTags('Member Service')
@ApiBearerAuth()
export class RoleController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(RoleController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('listing')
  getListRole(@Query() query: TimerDto, @Body() payload: QueryRoleDto) {
    const functionName = RoleController.prototype.getListRole.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = {
      payload: Object.assign(payload, query),
    };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }
}
