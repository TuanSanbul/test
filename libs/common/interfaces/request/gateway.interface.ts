import { HttpStatus } from '@nestjs/common';

export interface IGatewayResponse {
  statusCode: HttpStatus;
  data: Array<unknown> | unknown;
  message: string;
  errors: Array<unknown> | unknown;
}

export interface IGatewayError {
  errorCode: number;
  errorMessage: string | string[];
}

export interface IMetadata {
  roles: string;
  isPublic: string;
  skipJwt: string;
}

export interface IRoleInit {
  admin: string;
  member: string;
}

export interface IRequestLimit {
  time: number;
  limit: number;
}
