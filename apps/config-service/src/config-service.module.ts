import { dbConfig } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { configuration } from '@lib/config';
import { DatabaseModule } from '@lib/core/databases';
import { Bank, BankSchema } from '@lib/core/databases/mongo';
import { mapEntities } from '@lib/utils/helpers';
import { HealthModule, LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BlackListModule } from './black-list';
import { ConfigController } from './config.controller';
import { ConfigService as ConfigServiceClass } from './config.service';
import { MainConfigModule } from './main-config';
import { MarketModule } from './market';
import { PreferenceModule } from './preference';
import { GameConfigModule } from './game-config';

const entities: IEntitiesMapMetadata = {
  [DbName.Mongo]: [{ name: Bank.name, schema: BankSchema }],
};
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
    ...mapEntities(entities),
    PreferenceModule,
    BlackListModule,
    GameConfigModule,
    MainConfigModule,
    MarketModule,
  ],
  controllers: [ConfigController],
  providers: [ConfigServiceClass],
})
export class ConfigServiceModule {}
