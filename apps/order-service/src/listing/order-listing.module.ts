import { DbName } from '@lib/common/enums';
import { getEntitiesPostgres, mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { OrderDetailModule } from '../detail';
import { TCPCallModule } from '../tcp-call';
import { OrderListingController } from './order-listing.controller';
import { OrderListingService } from './order-listing.service';
import { OrderQueryService } from './order-query.service';

const entities = {
  [DbName.Postgres]: getEntitiesPostgres(),
};

@Module({
  imports: [
    LoggerModule,
    ...mapEntities(entities),
    OrderDetailModule,
    TCPCallModule,
  ],
  controllers: [OrderListingController],
  providers: [OrderQueryService, OrderListingService],
})
export class OrderListingModule {}
