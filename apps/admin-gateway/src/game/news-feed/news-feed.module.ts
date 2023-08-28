import { NewsFeedController } from './news-feed.controller';

import { Module } from '@nestjs/common';

@Module({
  controllers: [NewsFeedController],
})
export class NewsFeedModule {}
