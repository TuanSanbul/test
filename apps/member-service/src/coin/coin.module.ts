import { DbName } from '@lib/common/enums';
import { CoinLog, Member } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';

const entitiesDefine = {
  [DbName.Postgres]: [Member, CoinLog],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entitiesDefine)],
  controllers: [CoinController],
  providers: [CoinService],
  exports: [CoinService],
})
export class CoinModule {}
