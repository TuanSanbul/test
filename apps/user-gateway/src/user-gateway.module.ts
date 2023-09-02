import { configuration } from '@lib/config/configuration';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthServiceModule } from './auth';
import { CalculateServiceModule } from './calculate';
import { GameServiceModule } from './game';
import { MemberServiceModule } from './member';
import { OrderServiceModule } from './order';

const ServicesModule = [
  AuthServiceModule,
  MemberServiceModule,
  GameServiceModule,
  CalculateServiceModule,
  OrderServiceModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ...ServicesModule,
  ],
})
export class UserGatewayModule {}
