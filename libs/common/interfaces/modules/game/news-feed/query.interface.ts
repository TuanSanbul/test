import {
  ITimerQuery,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces/request';
import { GameFeed } from '@lib/core/databases/postgres';

export interface IQueryNewsFeed extends ITimerQuery {
  queryFields: QueryFields<GameFeed>;
  orderFields: OrderFields<GameFeed>;
}

export enum GameDetailStatus {
  Pending = 'PENDING',
  Open = 'OPEN',
  Close = 'CLOSE',
  Other = 'OTHER',
}

export enum GameFeedType {
  PreMatch = 'PRE_MATCH',
  InPlay = 'IN_PLAY',
}

export enum GameEventStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Abandoned = 'ABANDONED',
  Suspended = 'SUSPENDED',
  Resulted = 'RESULTED',
}

export enum GameMatchStatus {
  NotYet = 'NOT_YET',
  Inprogress = 'INPROGRESS',
  Interrupted = 'INTERRUPTED',
  Finish = 'FINISHED',
  NotAvailable = 'NOT_AVAILABLE',
  Abandoned = 'ABANDONED',
  Postponed = 'POSTPONED',
  Resulted = 'RESULTED',
  Canceled = 'CANCELED',
}
