import { ServiceName } from '@lib/common/enums';
import { ResponseResult } from '@lib/common/types';
import { Bank } from '@lib/core/databases/mongo';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';

@Controller()
@ApiTags('Config Service')
export class ConfigController {
  static prefixCmd = [ServiceName.CONFIG_SERVICE, ConfigController.name];

  constructor(private readonly configService: ConfigService) {}

  @MessagePattern({
    cmd: getPattern(
      ConfigController.prefixCmd,
      ConfigController.prototype.getListBank.name,
    ),
  })
  getListBank(): Promise<ResponseResult<Bank[]>> {
    return this.configService.getListBank();
  }
}
