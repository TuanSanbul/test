import { IJwtPayload } from '../auth';

export interface IRejectWithdrawal {
  id: string;
  request: IJwtPayload;
}

export interface ICreateWithdrawal {
  memberId: string;
  amount: number;
  ipAddress: string;
  request: IJwtPayload;
}

export interface IRejectWithdrawal {
  request: IJwtPayload;
  id: string;
}
