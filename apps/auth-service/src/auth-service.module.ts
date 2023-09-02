import { dbConfig } from '@lib/common/constants';
import { configuration } from '@lib/config';
import { DatabaseModule } from '@lib/core/databases';
import { HealthModule, LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthServiceController } from './auth-service.controller';
import { ProfileModule } from './profile/profile.module';
import { RegisterModule } from './register/register.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    HealthModule,
    LoggerModule,
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
    SessionModule,
    RegisterModule,
    ProfileModule,
  ],
  controllers: [AuthServiceController],
})
export class AuthServiceModule {}
