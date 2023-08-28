export interface ICreateDeposit {
  memberId: string;
  amount: number;
  ipAddress: string;
  rechargeId: string;
  rechargeItemId: string;
}

export interface IGetBonus {
  total: number;
  firstChargeBonus: number;
  reChargeBonus: number;
  status: boolean;
}
