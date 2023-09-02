export enum MoneyLogStatus {
  Pending = 0,
  Success = 1,
  Fail = 2,
}

export enum MoneyLogSource {
  Deposit = 'DEPOSIT',
  Withdraw = 'WITHDRAW',
  Order = 'ORDER',
  Reference = 'REFERENCE',
  Win = 'WIN',
  Loss = 'LOSS',
  Refund = 'REFUND',
  System = 'SYSTEM',
  Other = 'OTHER',
}
