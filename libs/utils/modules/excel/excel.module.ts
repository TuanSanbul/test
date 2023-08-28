import { Module } from '@nestjs/common';
import { ExcelService } from './excel.service';

@Module({
  providers: [ExcelService],
  controllers: [],
  exports: [ExcelService],
})
export class ExcelModule {}
