import {
  OrderCurrency,
  OrderDetailResult,
  OrderState,
  Sort,
} from '@lib/common/enums';
import { ITimerQuery } from '../../request';
import { IPayloadCreateOrderDetail } from './detail';

export interface IPayloadCreateOrder {
  betAmount: number;
  expectWinning: number;
  rate: number;
  currency: OrderCurrency;
  orderDetails: IPayloadCreateOrderDetail[];
  ipAddress: string;
}

export interface IOrderFieldsOrder {
  createdAt: Sort;
  expectWinning: Sort;
  betAmount: Sort;
}

export interface IQueryFieldsOrder {
  orderDetailResult: OrderDetailResult;
  orderState: OrderState;
  isAdmin: false;
  marketId: string;
  username: string;
  nickName: string;
  ipAddress: string;
  orderCode: string;
  homeTeamName: string;
  awayTeamName: string;
  leagueName: string;
  gameFeedId: string;
  gameId: string;
  gameCategoryId: string;
  isInterested: boolean;
}

export interface IQueryOrder extends ITimerQuery {
  queryFields: IQueryFieldsOrder;
  orderFields: IOrderFieldsOrder;
}
