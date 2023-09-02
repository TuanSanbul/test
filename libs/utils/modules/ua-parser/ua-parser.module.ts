import { Global, Module } from '@nestjs/common';
import { UserAgentService } from './ua-parser.service';
import { CryptoModule } from '../crypto';

@Global()
@Module({
  imports: [CryptoModule],
  providers: [UserAgentService],
  exports: [UserAgentService],
})
export class UserAgentModule {}
