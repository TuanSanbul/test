import { Module } from '@nestjs/common';
import { MoneyController } from './money.controller';

@Module({ controllers: [MoneyController] })
export class MoneyModule {}
