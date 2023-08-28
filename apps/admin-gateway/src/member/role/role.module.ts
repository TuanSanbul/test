import { ServiceProviderModule } from '@lib/core/message-handler';

import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [RoleController],
})
export class RoleModule {}
