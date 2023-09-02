import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [MemberController],
})
export class MemberModule {}
