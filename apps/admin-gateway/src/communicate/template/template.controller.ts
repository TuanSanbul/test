import { PaginateDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import {
  IMessage,
  IPatternMessage,
  IQueryMessage,
} from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { CommunicateTemplate } from '@lib/core/databases/mongo';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTemplateDto, UpdateTemplateDto } from './dto';
import { QueryTemplateDto } from './dto/query.dto';

@Controller('communicate/template')
@ApiTags('Communicate Service')
@ApiBearerAuth()
export class TemplateController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(TemplateController.name, ServiceName.COMMUNICATE_SERVICE);
  }

  @Post('create')
  async createTemplate(@Body() payload: CreateTemplateDto) {
    const functionName = TemplateController.prototype.createTemplate.name;
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
  async updateTemplate(
    @Param('id') id: string,
    @Body() payload: UpdateTemplateDto,
  ) {
    const functionName = TemplateController.prototype.updateTemplate.name;
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
  async getOneTemplate(@Param('id') id: string) {
    const functionName = TemplateController.prototype.getOneTemplate.name;
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
  async getListTemplate(
    @Query() query: PaginateDto,
    @Body() payload: QueryTemplateDto,
  ) {
    const functionName = TemplateController.prototype.getListTemplate.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage<IQueryMessage<CommunicateTemplate>> = {
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

  @Delete('delete/:id')
  async deleteTemplate(@Param('id') id: string) {
    const functionName = TemplateController.prototype.deleteTemplate.name;
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
}
