import { Member } from '@lib/core/databases/postgres';

export interface IRegisterMember extends Partial<Member> {
  recommenderCode: string;
}

export interface IAccountInit {
  username: string;
  password: string;
  exchangePassword: string;
  phone: string;
}

export interface IRoleInit {
  admin: string;
  member: string;
}
