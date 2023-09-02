import { DbConfig, DbName } from '@lib/common/enums';
import { configuration } from '@lib/config';
import { DatabaseModule } from '@lib/core/databases';
import { HealthModule, LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DepositModule } from './deposit';

const dbConfig: Partial<Record<DbName, DbConfig>> = {
  [DbName.Postgres]: DbConfig.Postgres,
  [DbName.Mongo]: DbConfig.Mongo,
};

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
    DepositModule,
  ],
})
export class CalculateServiceModule {}
