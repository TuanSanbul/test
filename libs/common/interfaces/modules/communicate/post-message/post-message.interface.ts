import { Sort } from '@lib/common/enums';
import {
  IPagination,
  OrderFields,
  QueryFields,
} from '@lib/common/interfaces/request';
import { PostMessage } from '@lib/core/databases/postgres';

export interface ICreatePostMessage
  extends Omit<Partial<PostMessage>, 'receiver' | 'sender'> {
  receivers: string[];
  sender: string;
}

export interface IQueryFieldsPostMessage extends QueryFields<PostMessage> {
  nickName: string;
  username: string;
}

export interface IOrderFieldsPostMessage extends OrderFields<PostMessage> {
  username: Sort;
  level: Sort;
  nickName: Sort;
}

export interface IQueryPostMessage extends IPagination {
  queryFields: IQueryFieldsPostMessage;
  orderFields: IOrderFieldsPostMessage;
}
