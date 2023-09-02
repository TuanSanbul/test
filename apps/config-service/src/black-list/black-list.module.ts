import { BlackListController } from './black-list.controller';
import { BlackListService } from './black-list.service';
import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { getEntitiesPostgres, mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: getEntitiesPostgres(),
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [BlackListController],
  providers: [BlackListService],
})
export class BlackListModule {}
