import { GenderEnum } from '@lib/common/enums';

export interface IUpdateMultiMember {
  id: string;
  username: string;
  level: number;
  group: string;
  leaveDate: Date;
  interceptDate: Date;
}

export interface IUpdateConfigMember {
  password: string;
  phone: string;
  bankName: string;
  bankOwnerName: string;
  bankAccountNumber: string;
  leaveDate: Date;
  interceptDate: Date;
}

export interface IUpdateDetailMember extends IUpdateConfigMember {
  exchangePassword: string;
  isInterested: boolean;
  level: number;
  group: string;
  verifiedPhone: boolean;
  role: string;
  actorLevel?: number;
}

export interface IPayloadCreateMember {
  recommenderCode?: string;
  nickName: string;
  fullName: string;
  gender?: GenderEnum;
  email?: string;
  phone: string;
  address?: string;
  username: string;
  password: string;
  exchangePassword: string;
  bankName: string;
  bankOwnerName: string;
  bankAccountNumber: string;
  isInterested?: boolean;
  role?: string;
}
