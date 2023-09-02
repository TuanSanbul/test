import { MarketConfigStatus } from '../enums';
import { RechargeBonusState } from '../interfaces/modules/preference';

const DEFAULT_VALUE = 'default';

export const memberConfigData = {
  isAcceptRegisterMember: false,
  isInstantApproval: false,
  isSignUpLetter: false,
  maximumRating: 0,
  messageWelcome: DEFAULT_VALUE,
  messageReply: DEFAULT_VALUE,
  memberRegisterGroup: 'A',
  memberRegisterLevel: 0,
};

export const noticeConfigData = {
  isUseNotice: false,
  noticeTitle: DEFAULT_VALUE,
  noticeMessage: DEFAULT_VALUE,
};

export const getMainConfigData = (memberConfigId, noticeConfigId) => ({
  firstPointStatus: false,
  companyName: DEFAULT_VALUE,
  realtimeNotice: DEFAULT_VALUE,
  filterWord: DEFAULT_VALUE,
  prohibitedWord: DEFAULT_VALUE,
  memberConfigId: memberConfigId,
  noticeConfigId: noticeConfigId,
  limitComboQuantity: 0,
  limitComboOdds: 0,
  rechargeAmount: 0,
  isUseCouponItem: true,
  isUseFirstChargeBonus: false,
  firstChargePointBonus: 0,
  isFCMaxPointApply: false,
  firstChargeMaxPoint: 0,
  isRCMaxPointApply: false,
  RechargeMaxPoint: 0,
  isMaxCoinBonusApply: false,
  firstChargeCoinBonus: 0,
  rechargeCoinBonus: 0,
});

export const getDepositData = (mainConfigId) => [
  {
    mainConfigId,
    value: DEFAULT_VALUE,
    memberRegisterLevel: 1,
    memberRegisterGroup: 'A',
  },
  {
    mainConfigId,
    value: DEFAULT_VALUE,
    memberRegisterLevel: 2,
    memberRegisterGroup: 'A',
  },
  {
    mainConfigId,
    value: DEFAULT_VALUE,
    memberRegisterLevel: 3,
    memberRegisterGroup: 'A',
  },
  {
    mainConfigId,
    value: DEFAULT_VALUE,
    memberRegisterLevel: 4,
    memberRegisterGroup: 'A',
  },
  {
    mainConfigId,
    value: DEFAULT_VALUE,
    memberRegisterLevel: 5,
    memberRegisterGroup: 'A',
  },
];

export const getMarketConfigData = () => [
  {
    state: true,
    nameKo: 'K뱅크',
  },
  {
    state: true,
    nameKo: 'SC제일',
  },
  {
    state: true,
    nameKo: '국민',
  },
  {
    state: true,
    nameKo: '기업',
  },
  {
    state: true,
    nameKo: '대우',
  },
  {
    state: true,
    nameKo: '도이치',
  },
  {
    state: true,
    nameKo: '동양증권',
  },
  {
    state: true,
    nameKo: '미래에셋',
  },
  {
    state: true,
    nameKo: '우리투자증권',
  },
  {
    state: true,
    nameKo: '우체국',
  },
  {
    state: true,
    nameKo: '유안타증권',
  },
  {
    state: true,
    nameKo: '전북',
  },
  {
    state: true,
    nameKo: '제주',
  },
];

export const getBankConfigData = () => [
  {
    status: MarketConfigStatus.Active,
    name: 'over under',
    nameKo: '오버언더',
  },
  {
    status: MarketConfigStatus.Active,
    name: 'handicap',
    nameKo: '핸디캡',
  },
  {
    status: MarketConfigStatus.Active,
    name: 'win or lose',
    nameKo: '승무패',
  },
  {
    status: MarketConfigStatus.Deactivate,
    name: 'over',
    nameKo: '위에',
  },
  {
    status: MarketConfigStatus.Deactivate,
    name: 'under',
    nameKo: '아래에',
  },
  {
    status: MarketConfigStatus.Active,
    name: 'other',
    nameKo: '기타',
  },
];

export const getRechargeData = (mainConfigId) => [
  {
    level: 0,
    status: false,
    mainConfigId,
  },
  {
    level: 1,
    status: false,
    mainConfigId,
  },
  {
    level: 2,
    status: false,
    mainConfigId,
  },
  {
    level: 3,
    status: false,
    mainConfigId,
  },
  {
    level: 4,
    status: false,
    mainConfigId,
  },
  {
    level: 5,
    status: false,
    mainConfigId,
  },
  {
    level: 6,
    status: false,
    mainConfigId,
  },
];

export const getRechargeItemData = (rechargeBonusId) => [
  {
    rechargeBonusId,
    firstRechargePercent: 0,
    level: 0,
    rechargePercent: 0,
    rechargeName: DEFAULT_VALUE,
    status: false,
    type: RechargeBonusState.Unpaid,
  },
  {
    rechargeBonusId,
    firstRechargePercent: 0,
    level: 0,
    rechargePercent: 0,
    rechargeName: DEFAULT_VALUE,
    status: false,
    type: RechargeBonusState.Unpaid,
  },
  {
    rechargeBonusId,
    firstRechargePercent: 0,
    level: 0,
    rechargePercent: 0,
    rechargeName: DEFAULT_VALUE,
    status: false,
    type: RechargeBonusState.Unpaid,
  },
  {
    rechargeBonusId,
    firstRechargePercent: 0,
    level: 0,
    rechargePercent: 0,
    rechargeName: DEFAULT_VALUE,
    status: false,
    type: RechargeBonusState.Unpaid,
  },
];

export const getComboData = (mainConfigId) => [
  {
    quantity: 0,
    odds: 0,
    mainConfigId,
  },
  {
    quantity: 0,
    odds: 0,
    mainConfigId,
  },
  {
    quantity: 0,
    odds: 0,
    mainConfigId,
  },
];

export const getAttendanceData = (mainConfigId) => [
  {
    daysOfAttendance: 0,
    reward: 0,
    mainConfigId,
  },
  {
    daysOfAttendance: 0,
    reward: 0,
    mainConfigId,
  },
  {
    daysOfAttendance: 0,
    reward: 0,
    mainConfigId,
  },
  {
    daysOfAttendance: 0,
    reward: 0,
    mainConfigId,
  },
];

export const getBulletinData = (mainConfigId) => [
  {
    quantity: 0,
    reward: 0,
    mainConfigId,
  },
];

export const getCommentData = getBulletinData;
