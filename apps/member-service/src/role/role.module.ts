import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { CacheModule } from '@lib/core/caching';
import { getEntitiesPostgres, mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: getEntitiesPostgres(),
};

@Module({
  imports: [LoggerModule, CacheModule, ...mapEntities(entities)],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
