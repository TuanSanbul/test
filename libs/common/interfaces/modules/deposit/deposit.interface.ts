import { Deposit, Member, Withdrawal } from '@lib/core/databases/postgres';
import { IJwtPayload } from '../auth';

export interface IApproveDeposit {
  id: string;
  request: IJwtPayload;
}

export interface IRemoveBankCheck {
  listId: string[];
}

export interface IQueryFieldDeposit extends Deposit, Member {
  recommenderUsername: string;
}

export interface IQueryFieldWithdraw extends Withdrawal, Member {
  recommenderUsername: string;
}
