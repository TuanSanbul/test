import { Member } from '@lib/core/databases/postgres';
import { IPayloadMemberGameConfig } from '../interfaces/modules/member';

export const relatedMemberInfo: Partial<Record<keyof Member, boolean>> = {
  id: true,
  username: true,
  nickName: true,
  level: true,
  group: true,
};

export const initMemberGameConfig: IPayloadMemberGameConfig = {
  status: false,
  firstChargePoint: 0,
  percentPerCharge: 0,
  winOdds: 0,
  lossOdds: 0,
  handicap: 0,
  dividendFor4Folders: 0,
  minimumDividendFor4Folders: 0,
  liveBetting: 0,
  payback: 0,
};
