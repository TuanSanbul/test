import { ServiceProviderModule } from '@lib/core/message-handler';

import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [ProfileController],
  providers: [],
})
export class ProfileModule {}
