import { RegisterCodeType } from '@lib/common/enums';

export interface IRegisterCode {
  id?: string;
  bonus: number;
  recommendCode: string;
  registeredDomain: string;
  type: RegisterCodeType;
  detail?: string;
  memberId: string;
}

export interface IGetRegisterCodes {
  memberId: string;
  recommendCode: string;
  type: RegisterCodeType;
  registeredDomain: string;
  detail?: string;
}
