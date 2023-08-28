import { UserDecorator } from '@lib/common/decorators';
import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { BaseGatewayController } from '@lib/core';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { TimeFilterDto } from '@lib/utils/validation-pipe';
import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PointInsertDto, QueryBodyPointDto } from './dto';

@Controller('point')
@ApiTags('Member Service')
@ApiBearerAuth()
export class PointController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(PointController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('logs/listing')
  async getList(
    @Query() query: TimeFilterDto,
    @Body() body: QueryBodyPointDto,
  ) {
    const functionName = PointController.prototype.getList.name;
    const message = { payload: Object.assign(query, body) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('insert')
  async insert(
    @UserDecorator() userRequest: IJwtPayload,
    @Body() body: PointInsertDto,
  ) {
    const functionName = PointController.prototype.insert.name;
    const message = { payload: body, request: userRequest };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
