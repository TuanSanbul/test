import { TimeFilterDto } from '@lib/utils/validation-pipe';

export interface ISumMoney {
  memberId: string;
  startTime?: Date | string;
  endTime?: Date | string;
}

export interface IGetHistory extends TimeFilterDto {
  memberId: string;
}
