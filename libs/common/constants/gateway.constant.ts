import { IMetadata } from '../interfaces';

export enum GatewaysName {
  ADMIN_GATEWAY = 'adminGateway',
  USER_GATEWAY = 'userGateway',
}

export const localIp = '127.0.0.1';

export const IS_PUBLIC_KEY = 'isPublic';

export const metaData: IMetadata = {
  roles: 'ROLES',
  isPublic: 'PUBLIC',
  skipJwt: 'SKIPJWT',
} as const;
