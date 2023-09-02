import { GameConfigController } from './game-config.controller';
import { GameConfigService } from './game-config.service';

import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import {
  GameTypeConfig,
  GameTypeConfigSchema,
} from '@lib/core/databases/mongo';
import { GameCategory, GameType } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [GameCategory, GameType],
  [DbName.Mongo]: [{ name: GameTypeConfig.name, schema: GameTypeConfigSchema }],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [GameConfigController],
  providers: [GameConfigService],
})
export class GameConfigModule {}
