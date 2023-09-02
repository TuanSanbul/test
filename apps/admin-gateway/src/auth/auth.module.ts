import { ServiceProviderModule } from '@lib/core/message-handler';
import { UserAgentModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [ServiceProviderModule, UserAgentModule],
  controllers: [AuthController],
})
export class AuthServiceModule {}
