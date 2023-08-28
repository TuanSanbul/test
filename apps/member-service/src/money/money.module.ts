import { DbName } from '@lib/common/enums';
import { Member, MoneyLog } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { MoneyController } from './money.controller';
import { MoneyService } from './money.service';

const entitiesDefine = {
  [DbName.Postgres]: [Member, MoneyLog],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entitiesDefine)],
  controllers: [MoneyController],
  providers: [MoneyService],
  exports: [MoneyService],
})
export class MoneyModule {}
