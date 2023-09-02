export enum PointSource {
  Deposit = 'DEPOSIT',
  Order = 'ORDER',
  Exchange = 'EXCHANGE',
  Reference = 'REFERENCE',
  Event = 'EVENT',
  System = 'SYSTEM',
  Other = 'OTHER',
}

export enum PointType {
  Positive = 'POSITIVE',
  Negative = 'NEGATIVE',
}

export enum PointStatus {
  Pending = 0,
  Success = 1,
  Fail = 2,
}
