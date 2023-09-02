import { EGameType, EUserType } from '@lib/common/enums';
import { GameConfig } from '@lib/core/databases/mongo';

export enum RechargeBonusState {
  FirstCharge = 'FIRST_CHARGE',
  Recharge = 'RECHARGE',
  Unpaid = 'UNPAID',
}

export interface IRechargeBonusItem {
  id: string;
  type: RechargeBonusState;
  firstRechargePercent: number;
  rechargePercent: number;
  rechargeName: string;
  status: boolean;
  rechargeBonusId: string;
}

export interface IRechargeBonus {
  id: string;
  status: boolean;
  listItem: IRechargeBonusItem[];
}

export interface IChargeConfigInfo {
  isUseFirstChargeBonus: boolean;
  firstChargePointBonus: number;

  isFCMaxPointApply: boolean;
  firstChargeMaxPoint: number;

  isRCMaxPointApply: boolean;
  RechargeMaxPoint: number;

  isMaxCoinBonusApply: boolean;
  firstChargeCoinBonus: number;
  rechargeCoinBonus: number;

  mainConfigId?: string;
}

export interface IListRechargeBonus {
  chargeConfigInfo: IChargeConfigInfo;
  rechargeBonus: IRechargeBonus[];
}

export interface IBonus {
  id: string;
  userType: EUserType;
  gameType: EGameType;
  status: boolean;
  applyDate: Date;
  mainConfigId?: string;
  levelRates?: ILevelRate[];
}

export interface ILevelRate {
  id?: string;
  level: number;
  rate: number;
  maxWinning?: number;
}

export interface ICreateLevelRates {
  gameConfigId: string;
  data: ILevelRate[];
}

export interface ILostBonus {
  user: IBonus | null;
  recommender: IBonus | null;
}

export enum EnumUpdateGameMode {
  MiniGameLostBonus = 'miniGameLostBonus',
  SportsLostBonus = 'sportsLostBonus',
  VirtualGameLostBonus = 'virtualGameLostBonus',
}

export interface IUpdateGameBonus {
  gameConfig: Partial<GameConfig>;
  levelRates: ILevelRate[];
}

export type ICreateGameBonus = IUpdateGameBonus;

export interface IComboBonus {
  quantity: number;
  odds: number;
  mainConfigId: string;
}

export interface IUpdateComboBonus {
  quantity: number;
  odds: number;
  id: string;
}

export interface IUpdateBonusFolder {
  mainConfigId: string;
  limitComboQuantity: number;
  limitComboOdds: number;
  comboBonus: IUpdateComboBonus[];
}

export interface IAttendanceBonus {
  daysOfAttendance: number;
  reward: number;
  mainConfigId: string;
}

export interface IBulletinBonus {
  quantity: number;
  reward: number;
  mainConfigId: string;
}

export type ICommentBonus = IBulletinBonus;

export interface IListBonus<T> {
  data: T[];
  mainConfigId: string;
}

export interface IUpdateAttendanceBonus {
  daysOfAttendance: number;
  reward: number;
  id: string;
}

export interface IUpdateBulletinBonus {
  quantity: number;
  reward: number;
  id: string;
}

export type IUpdateCommentBonus = IUpdateBulletinBonus;
export interface IUpdateAttendance {
  attendanceBonus: IUpdateAttendanceBonus[];
  bulletinBonus: IUpdateBulletinBonus[];
  commentBonus: IUpdateCommentBonus[];
  rechargeAmount: number;
  mainConfigId: string;
}
