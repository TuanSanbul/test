import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { TimeFilterDto } from '@lib/utils/validation-pipe';
import { Body, Controller, Delete, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateAttendanceDto, QueryAttendanceDto } from './dto';

@Controller('attendance')
@ApiTags('Member Service')
@ApiBearerAuth()
export class AttendanceController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(AttendanceController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('listing')
  async getList(
    @Query() query: TimeFilterDto,
    @Body() body: QueryAttendanceDto,
  ) {
    const functionName = AttendanceController.prototype.getList.name;
    const message = { payload: Object.assign(query, body) };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('create')
  async createAttendance(@Body() body: CreateAttendanceDto) {
    const functionName = AttendanceController.prototype.createAttendance.name;
    const message = { payload: body };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Delete('delete/:id')
  async deleteAttendance(@Param('id') id: string) {
    const functionName = AttendanceController.prototype.deleteAttendance.name;
    const message = { id };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
