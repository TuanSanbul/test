import { MultipleDeleteDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateNoteDto } from './dto';

@Controller('note')
@ApiTags('Member Service')
@ApiBearerAuth()
export class NoteController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(NoteController.name, ServiceName.MEMBER_SERVICE);
  }

  @Post('create')
  async createNote(@Body() body: CreateNoteDto) {
    const functionName = NoteController.prototype.createNote.name;
    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    const message = { payload: { ...body } };

    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }

  @Post('delete')
  async deleteNote(@Body() body: MultipleDeleteDto) {
    const functionName = NoteController.prototype.deleteNote.name;
    const message = { payload: body };

    const pattern: IPatternMessage = { cmd: this.prefixCmd(functionName) };
    return this.serviceClient.sendMessage(this.serviceName, message, pattern);
  }
}
