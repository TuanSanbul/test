import { ICommunicateSetting } from '@lib/core/databases/mongo';
import { Communicate, Member } from '@lib/core/databases/postgres';

export interface ICommunication
  extends Omit<Communicate, 'setting' | 'fileUrl' | 'author'> {
  fileUrl?: string;
  author: Member | string;
  setting: ICommunicateSetting;
}

export interface IGetDetailNotification {
  id: string;
  page: number;
  size: number;
}

export interface IQueryCommunicate extends Communicate, Member {
  deleted: boolean;
}
