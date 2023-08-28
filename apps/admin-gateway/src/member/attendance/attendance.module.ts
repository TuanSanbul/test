import { ServiceProviderModule } from '@lib/core/message-handler';
import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [ServiceProviderModule],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
