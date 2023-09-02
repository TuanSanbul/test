import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { Attendance, Member } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [Member, Attendance],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
