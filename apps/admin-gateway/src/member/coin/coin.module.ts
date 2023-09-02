import { Module } from '@nestjs/common';
import { CoinController } from './coin.controller';

@Module({ controllers: [CoinController] })
export class CoinModule {}
