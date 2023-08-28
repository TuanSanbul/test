import { IPayloadCreateAttendance } from '@lib/common/interfaces/modules/member';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendanceDto implements IPayloadCreateAttendance {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;
}
