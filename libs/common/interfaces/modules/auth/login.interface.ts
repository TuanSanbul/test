import { DeviceType } from '@lib/common/enums';

export interface ILoginPayload {
  loginPayload: { username: string; password: string };
  fingerPrint: IFingerPrint;
  validateRoles: string[];
}

export interface IFingerPrint {
  ipAddress: string;
  deviceId: string;
  deviceType: DeviceType;
  userAgent: string;
  country: string;
}
