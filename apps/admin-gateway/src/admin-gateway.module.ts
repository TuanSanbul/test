import { configuration } from '@lib/config';
import { HealthModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminGatewayController } from './admin-gateway.controller';
import { AuthServiceModule } from './auth';
import { CommunicateServiceModule } from './communicate';
import { ConfigServiceModule } from './config';
import { GameServiceModule } from './game';
import { MemberServiceModule } from './member';
import { OrderServiceModule } from './order';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    HealthModule,
    AuthServiceModule,
    ConfigServiceModule,
    MemberServiceModule,
    CommunicateServiceModule,
    GameServiceModule,
    OrderServiceModule,
  ],
  controllers: [AdminGatewayController],
})
export class AdminGatewayModule {}
