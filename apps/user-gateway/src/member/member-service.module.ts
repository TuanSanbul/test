import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { CouponModule } from './coupon';
import { TransactionModule } from './transaction';
import { RegisterCodeModule } from './register-code';

const ChildModules = [CouponModule, TransactionModule, RegisterCodeModule];

@Module({
  imports: [ServiceProviderModule, ...ChildModules],
})
export class MemberServiceModule {}
