import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { PostMessageController } from './post-message.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [PostMessageController],
})
export class PostMessageModule {}
