import { dbConfig } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { configuration } from '@lib/config/configuration';
import { DatabaseModule } from '@lib/core/databases';
import { TopLeagueSchema, TopLeagues } from '@lib/core/databases/mongo';
import { getEntitiesPostgres, mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { NewsFeedModule } from './news-feed';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: getEntitiesPostgres(),
  [DbName.Mongo]: [{ name: TopLeagues.name, schema: TopLeagueSchema }],
};

const ChildModules = [NewsFeedModule];
@Module({
  imports: [
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
    ...ChildModules,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class GameServiceModule {}
