import { PaginateDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryLoginLogDto } from './dto';

@Controller('login-log')
@ApiTags('Member Service')
export class LoginLogController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(LoginLogController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('listing')
  @ApiBearerAuth()
  async getListLogs(
    @Query() query: PaginateDto,
    @Body() body: QueryLoginLogDto,
  ) {
    const functionName = LoginLogController.prototype.getListLogs.name;
    const message = { payload: Object.assign(body, query) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
