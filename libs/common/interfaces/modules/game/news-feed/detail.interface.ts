import { QueryFields } from '@lib/common/interfaces/request';
import { GameDetail } from '@lib/core/databases/postgres';

export interface IQueryGameDetail {
  queryFields: QueryFields<GameDetail>;
}
