import { ServiceName } from '@lib/common/enums';
import {
  IMessage,
  IMutationResponse,
  IPaginationResponse,
} from '@lib/common/interfaces';
import {
  IPayloadCreateAttendance,
  IQueryAttendance,
} from '@lib/common/interfaces/modules/member';
import { getPattern } from '@lib/utils/helpers';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';
import { ResponseResult } from '@lib/common/types';
import { Member, Attendance } from '@lib/core/databases/postgres';

@Controller()
export class AttendanceController {
  static prefixCmd = [ServiceName.MEMBER_SERVICE, AttendanceController.name];
  constructor(private readonly attendanceService: AttendanceService) {}

  @MessagePattern({
    cmd: getPattern(
      AttendanceController.prefixCmd,
      AttendanceController.prototype.getList.name,
    ),
  })
  getList(
    message: IMessage<IQueryAttendance>,
  ): Promise<ResponseResult<IPaginationResponse<Member | Attendance>>> {
    const { payload } = message;
    return this.attendanceService.getList(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      AttendanceController.prefixCmd,
      AttendanceController.prototype.createAttendance.name,
    ),
  })
  createAttendance(
    message: IMessage<IPayloadCreateAttendance>,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { payload } = message;
    return this.attendanceService.createAttendance(payload);
  }

  @MessagePattern({
    cmd: getPattern(
      AttendanceController.prefixCmd,
      AttendanceController.prototype.deleteAttendance.name,
    ),
  })
  deleteAttendance(
    message: IMessage,
  ): Promise<ResponseResult<IMutationResponse>> {
    const { id } = message;
    return this.attendanceService.deleteAttendance(id);
  }
}
