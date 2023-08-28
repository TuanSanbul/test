export interface IJwtResponse {
  accessToken: string;
  refreshToken: string;
  accessExpiredAt: number;
  refreshExpiredAt: number;
}

export interface IJwtPayload {
  deviceId: string;
  memberLevel: number;
  memberId: string;
  roleId: string;
  exp?: number;
  ipAddress?: string;
}

export interface IRefreshTokenPayload {
  refreshToken: string;
  deviceId: string;
  validateRoles: string[];
}
