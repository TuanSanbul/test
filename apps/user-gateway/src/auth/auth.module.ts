import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserAgentModule } from '@lib/utils/modules';

@Module({
  imports: [ServiceProviderModule, UserAgentModule],
  controllers: [AuthController],
})
export class AuthServiceModule {}
