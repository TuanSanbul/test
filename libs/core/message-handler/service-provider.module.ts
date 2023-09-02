import { configuration } from '@lib/config';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServiceProviderBuilder } from './service-provider.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  providers: [ServiceProviderBuilder],
  exports: [ServiceProviderBuilder],
})
export class ServiceProviderModule {}
