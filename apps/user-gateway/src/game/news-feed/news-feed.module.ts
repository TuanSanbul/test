import { Module } from '@nestjs/common';
import { NewsFeedController } from './news-feed.controller';

@Module({ controllers: [NewsFeedController] })
export class NewsFeedModule {}
