import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { NewsFeedController } from './news-feed.controller';
import { NewsFeedService } from './news-feed.service';

@Module({
  imports: [LoggerModule],
  controllers: [NewsFeedController],
  providers: [NewsFeedService],
})
export class NewsFeedModule {}
