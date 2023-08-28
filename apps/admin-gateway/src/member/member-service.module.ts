import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { AttendanceModule } from './attendance';
import { CoinModule } from './coin';
import { CouponModule } from './coupon';
import { GameConfigModule } from './game-config';
import { LoginLogModule } from './login-log';
import { MemberServiceController } from './member-service.controller';
import { MoneyModule } from './money';
import { NoteModule } from './note';
import { PartnerModule } from './partner';
import { PointModule } from './point';
import { ProfileModule } from './profile';
import { RegisterCodeModule } from './register-code';
import { RoleModule } from './role';
import { MemberModule } from './service';
import { TransactionModule } from './transaction';

const Modules = [
  PointModule,
  ProfileModule,
  CouponModule,
  CoinModule,
  RegisterCodeModule,
  MoneyModule,
  MemberModule,
  NoteModule,
  PartnerModule,
  LoginLogModule,
  AttendanceModule,
  RoleModule,
  TransactionModule,
  GameConfigModule,
];

@Module({
  imports: [ServiceProviderModule, ...Modules],
  controllers: [MemberServiceController],
})
export class MemberServiceModule {}
