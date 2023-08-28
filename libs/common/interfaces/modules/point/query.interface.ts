import { PointType } from '@lib/common/enums';
import { PointLog } from '@lib/core/databases/postgres';
import { IQueryMessage } from '../../request';
import { IJwtPayload } from '../auth';
import { IPointInsert } from './insert.interface';

export type PointFilterBy = {
  type: PointType;
  roleId: string;
};
export type PointLogQuery = IQueryMessage<PointLog> & {
  filterBy: PointFilterBy;
};

export interface IPointMessage {
  payload: PointLogQuery | IPointInsert;
  request?: IJwtPayload;
}
