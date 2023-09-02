import { ServiceName } from '@lib/common/enums';
import { GatewayName } from '@lib/common/types';
import { HttpStatus } from '@nestjs/common';
import { ClientOptions } from '@nestjs/microservices';

export interface IServiceResponse {
  statusCode: HttpStatus;
  data: Array<unknown> | unknown;
  message: string;
  errors: unknown;
}
export interface IServiceRequest<T> {
  requestId: string;
  gateway: GatewayName;
  pattern: string;
  payload: T;
  serviceName: ServiceName;
  clientOptions: ClientOptions;
}

export interface IPatternMessage {
  cmd: string;
}

export interface IMessage<T = unknown> {
  id?: string;
  payload: T;
  searchTerm?: string;
}
