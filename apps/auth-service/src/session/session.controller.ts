import { IMessage, IMutationResponse } from '@lib/common/interfaces';
import {
  IJwtPayload,
  IJwtResponse,
  ILoginPayload,
  IRefreshTokenPayload,
} from '@lib/common/interfaces/modules/auth';
import { ResponseResult } from '@lib/common/types';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SessionService } from './session.service';

@Controller()
export class SessionController {
  static cmd = 'auth.';
  constructor(private readonly sessionService: SessionService) {}

  @MessagePattern({ cmd: SessionController.cmd + 'login' })
  login(payload: ILoginPayload): Promise<ResponseResult<IJwtResponse>> {
    return this.sessionService.login(payload);
  }

  @MessagePattern({ cmd: SessionController.cmd + 'refreshToken' })
  refreshToken(
    message: IMessage<IRefreshTokenPayload>,
  ): Promise<ResponseResult<IJwtResponse>> {
    const { deviceId, refreshToken, validateRoles = [] } = message.payload;
    return this.sessionService.refreshToken(
      deviceId,
      refreshToken,
      validateRoles,
    );
  }

  @MessagePattern({ cmd: SessionController.cmd + 'getActiveDeviceSession' })
  getActiveDeviceSession(payload: IJwtPayload): Promise<string | null> {
    return this.sessionService.getActiveDeviceSession(payload);
  }

  @MessagePattern({ cmd: SessionController.cmd + 'logout' })
  logout(payload: IJwtPayload): Promise<ResponseResult<IMutationResponse>> {
    return this.sessionService.logout(payload);
  }
}
