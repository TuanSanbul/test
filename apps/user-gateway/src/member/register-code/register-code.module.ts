import { ServiceProviderModule } from '@lib/core/message-handler';

import { Module } from '@nestjs/common';
import { RegisterCodeController } from './register-code.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [RegisterCodeController],
  providers: [],
})
export class RegisterCodeModule {}
