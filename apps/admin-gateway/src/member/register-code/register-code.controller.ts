import { PaginateDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import {
  IMessage,
  IPatternMessage,
  IQueryMessage,
} from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { RegisterCode } from '@lib/core/databases/postgres';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryRegCodeDto, RegisterCodeDto, UpdateRegisterCodeDto } from './dto';

@Controller('register-code')
@ApiTags('Member Service')
@ApiBearerAuth()
export class RegisterCodeController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(RegisterCodeController.name, ServiceName.MEMBER_SERVICE);
  }

  @HttpCode(HttpStatus.OK)
  @Post('update/:id')
  updateRegisterCode(
    @Param('id') id: string,
    @Body() payload: UpdateRegisterCodeDto,
  ) {
    const functionName =
      RegisterCodeController.prototype.updateRegisterCode.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage<RegisterCodeDto> = { id, payload };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('create')
  createRegisterCode(@Body() payload: RegisterCodeDto) {
    const functionName =
      RegisterCodeController.prototype.createRegisterCode.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage<RegisterCodeDto> = { payload };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('listing')
  getListRegisterCode(
    @Query() query: PaginateDto,
    @Body() payload: QueryRegCodeDto,
  ) {
    const functionName =
      RegisterCodeController.prototype.getListRegisterCode.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage<IQueryMessage<RegisterCode>> = {
      payload: { ...query, ...payload },
    };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getRegisterCodeById(@Param('id') id: string) {
    const functionName =
      RegisterCodeController.prototype.getRegisterCodeById.name;
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

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deleteRegisterCode(@Param('id') id: string) {
    const functionName =
      RegisterCodeController.prototype.deleteRegisterCode.name;
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
