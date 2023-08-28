export interface IPayloadMemberGameType {
  isAvailability: boolean;
  status: boolean;
  maxBetAmount: number;
  maxWinningAmount: number;
  dividendRate: number;
  losingPoint: number;
  referralDropPoint: number;
  miniGameBettingTime: number;
  memberId: string;
  gameTypeId: string;
}

export interface IPayloadUpdateGameType
  extends Omit<Partial<IPayloadMemberGameType>, 'memberId' | 'gameTypeId'> {
  id: string;
}

export interface IPayloadMemberGameConfig {
  status: boolean;
  firstChargePoint: number;
  percentPerCharge: number;
  winOdds: number;
  lossOdds: number;
  handicap: number;
  dividendFor4Folders: number;
  minimumDividendFor4Folders: number;
  liveBetting: number;
  payback: number;
}

export interface IPayloadUpdateMemberGameConfig
  extends IPayloadMemberGameConfig {
  id?: string;
  gameTypeConfigs?: IPayloadUpdateGameType[];
}
