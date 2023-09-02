import { MarketService } from './market.service';

import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { Market } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import * as mongo from '@lib/core/databases/mongo';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [Market],
  [DbName.Mongo]: [
    { name: mongo.MarketConfig.name, schema: mongo.MarketConfigSchema },
  ],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [MarketController],
  providers: [MarketService],
})
export class MarketModule {}
