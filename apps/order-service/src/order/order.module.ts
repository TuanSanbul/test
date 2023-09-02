import { DbName } from '@lib/common/enums';
import { getEntitiesPostgres, mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module, forwardRef } from '@nestjs/common';
import { OrderDetailModule } from '../detail';
import { TCPCallModule } from '../tcp-call';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

const entities = {
  [DbName.Postgres]: getEntitiesPostgres(),
};

@Module({
  imports: [
    LoggerModule,
    ...mapEntities(entities),
    forwardRef(() => OrderDetailModule),
    forwardRef(() => TCPCallModule),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
