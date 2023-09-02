import { BasicSettingOptions } from '@lib/common/enums';

export interface IMemberConfig {
  memberConfigId: string;
  isAcceptRegisterMember: boolean;
  isInstantApproval: boolean;
  maximumRating: number;
  isSignUpLetter: boolean;
  memberRegisterLevel: number;
  memberRegisterGroup: string;
  messageWelcome: string;
  messageReply: string;
}

export interface IDepositConfig {
  type: string;
}

export interface IListDepositConfig {
  mainConfigId: string;
  data: IDepositConfig[];
}

export interface IBasicSettingsMessage {
  option: BasicSettingOptions;
  data?: object;
}
export interface INoticeConfig {
  noticeConfigId: string;
  noticeTitle: string;
  noticeMessage: string;
  isUseNotice: boolean;
}

export interface ISiteSettings {
  mainConfigId: string;
  memberConfigId: string;
  companyName: string;
  memberRegisterLevel: number;
  realtimeNotice: string;
}

export interface IBasicSetting {
  isAcceptRegisterMember: boolean;
  isInstantApproval: boolean;
  messageReply: string;
  messageWelcome: string;
  maximumRating: number;
  memberRegisterGroup: string;
  isUseCouponItem: boolean;
  isSignUpLetter: boolean;
  companyName: string;
  realtimeNotice: string;
  noticeMessage: string;
  memberRegisterLevel: number;
  isUseNotice: boolean;
  depositResult: IDepositConfig[];

  memberConfigId: string;
  noticeConfigId: string;
  mainConfigId: string;
}

export interface IMainConfig {
  companyName: string;
  realtimeNotice: string;
  firstPointStatus: boolean;
  filterWord: string;
  prohibitedWord: string;
  memberConfigId: string;
  noticeConfigId: string;
  limitComboQuantity: number;
  limitComboOdds: number;
  RechargeAmount: number;
}
