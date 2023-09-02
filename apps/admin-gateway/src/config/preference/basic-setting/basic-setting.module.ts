import { ServiceProviderModule } from '@lib/core/message-handler';
import { BasicSettingController } from './basic-setting.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [ServiceProviderModule],
  controllers: [BasicSettingController],
  providers: [],
})
export class BasicSettingModule {}
