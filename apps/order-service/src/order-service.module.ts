import { dbConfig } from '@lib/common/constants';
import { configuration } from '@lib/config/configuration';
import { DatabaseModule } from '@lib/core/databases';
import { HealthModule, LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderDetailModule } from './detail';
import { OrderListingModule } from './listing';
import { OrderModule } from './order';
import { OrderInitService } from './order-init.service';
import { OrderServiceController } from './order-service.controller';

const modules = [OrderDetailModule, OrderModule, OrderListingModule];

@Module({
  imports: [
    LoggerModule,
    HealthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ...DatabaseModule.register({
      dbConfig,
      getConfig: (cf) => (configService: ConfigService) => {
        const schemaDbConfig = configService.get(cf);
        return Object.assign(
          {},
          schemaDbConfig,
          schemaDbConfig?.replication?.master,
        );
      },
    }),
    ...modules,
  ],
  controllers: [OrderServiceController],
  providers: [OrderInitService],
})
export class OrderServiceModule {}
