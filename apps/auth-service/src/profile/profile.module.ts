import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { getEntitiesPostgres, mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: getEntitiesPostgres(),
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
