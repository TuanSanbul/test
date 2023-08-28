import { IGatewayError } from '@lib/common/interfaces/request';
import { HttpStatus } from '@nestjs/common';

export class GatewayError extends Error {
  private errorObject: IGatewayError;
  constructor(error: any) {
    super(error.message);
    this.errorObject = {
      errorCode: error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      errorMessage: error?.message || null,
    };
  }

  public getErrorInstance(): IGatewayError {
    return this.errorObject;
  }
}
