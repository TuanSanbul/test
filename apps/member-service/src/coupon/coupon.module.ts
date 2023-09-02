import { DbName } from '@lib/common/enums';
import {
  CouponItems,
  CouponItemsSchema,
  MainConfig,
  MainConfigSchema,
} from '@lib/core/databases/mongo';
import { CoinLog, CouponLog, Member, Role } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { CoinService } from '../coin';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';

const entitiesDefine = {
  [DbName.Postgres]: [Member, CoinLog, CouponLog, Role],
  [DbName.Mongo]: [
    { name: CouponItems.name, schema: CouponItemsSchema },
    { name: MainConfig.name, schema: MainConfigSchema },
  ],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entitiesDefine)],
  controllers: [CouponController],
  providers: [CouponService, CoinService],
})
export class CouponModule {}
