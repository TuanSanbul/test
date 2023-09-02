import { MarketStatus, MarketType } from '@lib/common/enums';

export interface IUpdateMarket {
  id: string;
  name: string;
  order: number;
  status: MarketStatus;
  type: MarketType;
  score: number;
  marketConfigId: string;
}

export interface IUpdateListMarket {
  market: IUpdateMarket[];
}
