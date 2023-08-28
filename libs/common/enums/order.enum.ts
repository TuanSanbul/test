export enum OrderState {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Canceled = 'CANCELED',
  Rejected = 'REJECTED',
  Failed = 'FAILED',
}

export enum OrderCurrency {
  KRW = 'KRW',
  USD = 'USD',
  VND = 'VND',
}

export enum OrderDetailResult {
  Win = 'WIN',
  Lost = 'LOST',
  Draw = 'DRAW',
  Canceled = 'CANCELED',
  Waiting = 'WAITING',
}
