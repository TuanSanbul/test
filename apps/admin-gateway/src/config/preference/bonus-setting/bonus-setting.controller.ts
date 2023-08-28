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
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AttendanceBonusDto,
  BulletinBonusDto,
  ComboBonusDto,
  CommentBonusDto,
  CreateBonusDto,
  CreateLevelRatesDto,
  ListBonusDto,
  QueryMainConfigDto,
  UpdateGameBonusDto,
  UpdateRechargeDto,
  UpdateBonusFolderDto,
  UpdateAttendanceDto,
  RechargeItemDto,
  UpdateListRechargeDto,
} from './dto';

@Controller('preference/bonus-setting')
@ApiTags('Config Service')
@ApiBearerAuth()
export class BonusSettingController extends BaseGatewayController {
  constructor(private readonly serviceClient: ServiceProviderBuilder) {
    super(BonusSettingController.name, ServiceName.CONFIG_SERVICE);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getBonusSetting(@Query() query: QueryMainConfigDto) {
    const functionName = BonusSettingController.prototype.getBonusSetting.name;
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

  @Post('create-game-config')
  @HttpCode(HttpStatus.OK)
  createGameConfig(@Body() payload: CreateBonusDto) {
    const functionName = BonusSettingController.prototype.createGameConfig.name;
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

  @Post('create-level-rates')
  @HttpCode(HttpStatus.OK)
  createLevelRates(@Body() payload: CreateLevelRatesDto) {
    const functionName = BonusSettingController.prototype.createLevelRates.name;
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

  @Post('create-combo-bonus')
  @HttpCode(HttpStatus.OK)
  createComboBonus(@Body() payload: ListBonusDto<ComboBonusDto>) {
    const functionName = BonusSettingController.prototype.createComboBonus.name;
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

  @Post('create-comment-bonus')
  @HttpCode(HttpStatus.OK)
  createCommentBonus(@Body() payload: ListBonusDto<CommentBonusDto>) {
    const functionName =
      BonusSettingController.prototype.createCommentBonus.name;
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

  @Post('create-attendance-bonus')
  @HttpCode(HttpStatus.OK)
  createAttendanceBonus(@Body() payload: ListBonusDto<AttendanceBonusDto>) {
    const functionName =
      BonusSettingController.prototype.createAttendanceBonus.name;
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

  @Post('create-bulletin-bonus')
  @HttpCode(HttpStatus.OK)
  createBulletinBonus(@Body() payload: ListBonusDto<BulletinBonusDto>) {
    const functionName =
      BonusSettingController.prototype.createBulletinBonus.name;
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

  @Post('update-recharge')
  @HttpCode(HttpStatus.OK)
  updateRecharge(@Body() dto: UpdateRechargeDto) {
    const functionName = BonusSettingController.prototype.updateRecharge.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = {
      payload: dto,
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @Post('update-list-recharge')
  @HttpCode(HttpStatus.OK)
  updateListRecharge(@Body() dto: UpdateListRechargeDto) {
    const functionName =
      BonusSettingController.prototype.updateListRecharge.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message: IMessage = {
      payload: dto,
    };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @Get('recharge/:id')
  @HttpCode(HttpStatus.OK)
  getListRechargeBonus(@Param('id') id: string) {
    const functionName =
      BonusSettingController.prototype.getListRechargeBonus.name;
    const pattern: IPatternMessage = {
      cmd: this.prefixCmd(functionName),
    };
    const message = { id };

    return this.serviceClient.sendMessage(
      ServiceName.CONFIG_SERVICE,
      message,
      pattern,
    );
  }

  @Post('update-bonus-folder')
  @HttpCode(HttpStatus.OK)
  updateBonusFolder(@Body() payload: UpdateBonusFolderDto) {
    const functionName =
      BonusSettingController.prototype.updateBonusFolder.name;
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

  @Post('create-recharge-item')
  @HttpCode(HttpStatus.OK)
  createRechargeBonus(
    @Body()
    payload: RechargeItemDto,
  ) {
    const functionName =
      BonusSettingController.prototype.createRechargeBonus.name;
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

  @Post('update-game-bonus')
  @HttpCode(HttpStatus.OK)
  updateGameBonus(
    @Body()
    payload: UpdateGameBonusDto,
  ) {
    const functionName = BonusSettingController.prototype.updateGameBonus.name;
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

  @Post('update-attendance')
  @HttpCode(HttpStatus.OK)
  updateAttendance(
    @Body()
    payload: UpdateAttendanceDto,
  ) {
    const functionName = BonusSettingController.prototype.updateAttendance.name;
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
