import { ServiceProviderModule } from '@lib/core/message-handler';
import { BonusSettingController } from './bonus-setting.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [ServiceProviderModule],
  controllers: [BonusSettingController],
  providers: [],
})
export class BonusSettingModule {}
