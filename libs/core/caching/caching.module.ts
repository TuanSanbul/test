import { LoggerModule } from '@lib/utils/modules';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheService } from './caching.service';

@Global()
@Module({
  imports: [LoggerModule, ConfigModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
