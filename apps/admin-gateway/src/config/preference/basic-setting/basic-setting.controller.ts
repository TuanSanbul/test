import { ServiceName } from '@lib/common/enums';
import { IMessage, IPatternMessage } from '@lib/common/interfaces';
import { BaseGatewayController } from '@lib/core/base';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CreateMainConfigDto,
  CreateMemberConfigDto,
  CreateNoticeConfigDto,
  DepositSettingArrDto,
  NoticeConfigDto,
  QueryMainConfigDto,
  SiteSettingsDto,
  UpdateMemberConfigDto,
} from './dto';

@Controller('preference/basic-settings')
@ApiTags('Config Service')
@ApiBearerAuth()
export class BasicSettingController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(BasicSettingController.name, ServiceName.CONFIG_SERVICE);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getBasicSetting(@Query() query: QueryMainConfigDto) {
    const functionName = BasicSettingController.prototype.getBasicSetting.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = { id: query.id };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @Post('/create-member-config')
  @HttpCode(HttpStatus.OK)
  createMemberConfig(@Body() payload: CreateMemberConfigDto) {
    const functionName =
      BasicSettingController.prototype.createMemberConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = {
      payload,
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @Post('/create-notice-config')
  @HttpCode(HttpStatus.OK)
  createNoticeConfig(@Body() payload: CreateNoticeConfigDto) {
    const functionName =
      BasicSettingController.prototype.createNoticeConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = {
      payload,
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @Post('/create-main-config')
  @HttpCode(HttpStatus.OK)
  createMainConfig(@Body() payload: CreateMainConfigDto) {
    const functionName = BasicSettingController.prototype.createMainConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = {
      payload,
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('deposit/update')
  updateDeposit(@Body() payload: DepositSettingArrDto) {
    const functionName = BasicSettingController.prototype.updateDeposit.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message: IMessage = {
      payload,
    };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('create-deposit-config')
  createDepositConfig(@Body() payload: DepositSettingArrDto) {
    const functionName =
      BasicSettingController.prototype.createDepositConfig.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message: IMessage = {
      payload,
    };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('notice/update')
  updateNotice(@Body() payload: NoticeConfigDto) {
    const functionName = BasicSettingController.prototype.updateNotice.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message: IMessage = {
      payload,
    };
    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('member/update')
  updateMember(@Body() payload: UpdateMemberConfigDto) {
    const functionName = BasicSettingController.prototype.updateMember.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message: IMessage = {
      payload,
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('site/update')
  updateSite(@Body() payload: SiteSettingsDto) {
    const functionName = BasicSettingController.prototype.updateSite.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };

    const message: IMessage = {
      payload,
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }
}
