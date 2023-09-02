import { DbConfig, DbName } from '@lib/common/enums';
import { configuration } from '@lib/config';
import { DatabaseModule } from '@lib/core/databases';
import { CryptoModule, HealthModule, LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AttendanceModule } from './attendance';
import { CoinModule } from './coin';
import { CouponModule } from './coupon';
import { GameConfigModule } from './game-config';
import { LoginLogModule } from './login-log';
import { MemberModule } from './member';
import { MemberInitService } from './member-init.service';
import { MemberServiceController } from './member-service.controller';
import { MoneyModule } from './money';
import { NoteModule } from './notes';
import { PartnerModule } from './partner';
import { PointModule } from './point';
import { ProfileModule } from './profile';
import { RegisterCodeModule } from './register-code';
import { RoleModule } from './role';
import { TransactionModule } from './transaction';

const dbConfig: Partial<Record<DbName, DbConfig>> = {
  [DbName.Postgres]: DbConfig.Postgres,
  [DbName.Mongo]: DbConfig.Mongo,
};

const Modules = [
  CryptoModule,
  PointModule,
  ProfileModule,
  CoinModule,
  CouponModule,
  RegisterCodeModule,
  RoleModule,
  MoneyModule,
  MemberModule,
  NoteModule,
  PartnerModule,
  LoginLogModule,
  AttendanceModule,
  TransactionModule,
  GameConfigModule,
];

@Module({
  imports: [
    LoggerModule,
    HealthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ...DatabaseModule.register({
      dbConfig,
      getConfig: (cf) => (configService: ConfigService) => {
        const schemaDbConfig = configService.get(cf);
        return Object.assign(
          {},
          schemaDbConfig,
          schemaDbConfig?.replication?.master,
        );
      },
    }),
    ...Modules,
  ],
  controllers: [MemberServiceController],
  providers: [MemberInitService],
})
export class MemberServiceModule {}
