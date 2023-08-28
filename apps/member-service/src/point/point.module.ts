import { DbName } from '@lib/common/enums';
import { Member, PointLog } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { PointService } from './point.service';

const entitiesDefine = {
  [DbName.Postgres]: [Member, PointLog],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entitiesDefine)],
  controllers: [PointController],
  providers: [PointService],
})
export class PointModule {}
