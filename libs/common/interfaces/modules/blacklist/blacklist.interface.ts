export interface IUpdateBlackListIp {
  listIp: string[];
}

export type IDeleteBlackListIp = IUpdateBlackListIp;

export interface IBlackListMember {
  memberId?: string;
  detail?: string | null;
}
