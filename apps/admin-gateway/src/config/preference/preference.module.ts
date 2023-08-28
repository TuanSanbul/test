import { Module } from '@nestjs/common';
import { BonusSettingModule } from './bonus-setting';
import { ConfigWordsModule } from './config-words';
import { BasicSettingModule } from './basic-setting';
@Module({
  imports: [BonusSettingModule, ConfigWordsModule, BasicSettingModule],
})
export class PreferenceModule {}
