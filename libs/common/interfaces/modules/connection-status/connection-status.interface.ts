import { EConnStatusTab } from '@lib/common/enums';
import { LoginLog } from '@lib/core/databases/mongo';
import { TimeFilterDto } from '@lib/utils/validation-pipe';

export interface IConnStatusMessage extends TimeFilterDto {
  tab: EConnStatusTab;
}

export interface IConnStatusList extends LoginLog {
  count: number;

  rate: number;

  bar: number;

  domain?: string;

  os?: string;

  browser?: string;

  hour?: string;

  day?: string;

  date?: string;

  month?: string;

  year?: string;
}
