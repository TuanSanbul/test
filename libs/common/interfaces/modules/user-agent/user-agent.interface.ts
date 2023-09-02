import { DeviceType } from '@lib/common/enums';

export interface IUserAgentParser {
  ua: string;
  browser: IBrowser;
  engine: IEngine;
  os: IOperatorSystem;
  device: IDevice;
  cpu: ICPU;
  ipAddress?: string;
  country?: string;
}

export interface IBrowser {
  name: string;
  version: string;
  major: string;
}

export interface IEngine {
  name: string;
  version: string;
}

export type IOperatorSystem = IEngine;

export interface IDevice {
  vendor: string;
  model: string;
  type: DeviceType;
}

export interface ICPU {
  architecture: string;
}

export interface IHashKeyRequest {
  browserName: string;
  osName: string;
  memberId?: string;
  ipAddress?: string;
}

export interface IEncodeDeviceResult {
  deviceId: string;
  parseResult: IUserAgentParser;
}
