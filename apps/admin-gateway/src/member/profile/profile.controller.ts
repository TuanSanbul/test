import { PaginateDto } from '@lib/common/dto';
import { ServiceName } from '@lib/common/enums';
import { IMessage } from '@lib/common/interfaces';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { getPattern } from '@lib/utils/helpers';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryProfileDto } from './dto';

@Controller('member')
@ApiTags('Member Service')
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {}

  private readonly prefixCmd = [
    ServiceName.MEMBER_SERVICE,
    ProfileController.name,
  ];

  @HttpCode(HttpStatus.OK)
  @Post('search')
  getMembers(@Query() query: PaginateDto, @Body() payload: QueryProfileDto) {
    const pattern = {
      cmd: getPattern(
        this.prefixCmd,
        ProfileController.prototype.getMembers.name,
      ),
    };
    const message: IMessage = { payload: Object.assign(query, payload) };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      message,
      pattern,
    );
  }
}
