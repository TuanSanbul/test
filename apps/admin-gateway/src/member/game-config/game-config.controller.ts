import { ServiceName } from '@lib/common/enums';
import { IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateMemberGameConfigDto } from './dto';

@Controller('member')
@ApiTags('Member Service')
@ApiBearerAuth()
export class GameConfigController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(GameConfigController.name, ServiceName.MEMBER_SERVICE);
  }

  @Get('game-config/:id')
  async getGameConfig(@Param('id') id: string) {
    const functionName = GameConfigController.prototype.getGameConfig.name;
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

  @Post('game-config/update/:id')
  async updateMemberGameConfig(
    @Param('id') id: string,
    @Body() payload: UpdateMemberGameConfigDto,
  ) {
    const functionName =
      GameConfigController.prototype.updateMemberGameConfig.name;
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
}
