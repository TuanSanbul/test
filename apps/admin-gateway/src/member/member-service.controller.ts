import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces/services';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('member')
@ApiTags('Member Service')
export class MemberServiceController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {}

  @Get('health')
  async healthCheck() {
    const pattern: IPatternMessage = { cmd: 'member.healthCheck' };
    return this.serviceClient.sendMessage(
      ServiceName.MEMBER_SERVICE,
      {},
      pattern,
    );
  }
}
