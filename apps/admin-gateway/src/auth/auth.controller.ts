import { localIp } from '@lib/common/constants';
import { Public, RoleDecorator, UserDecorator } from '@lib/common/decorators';
import { RoleEnv, ServiceName } from '@lib/common/enums';
import {
  IJwtPayload,
  IJwtResponse,
  ILoginPayload,
} from '@lib/common/interfaces/modules/auth';
import { ICustomRequest, IGatewayError } from '@lib/common/interfaces/request';
import { IMutationResponse } from '@lib/common/interfaces/response';
import { IPatternMessage } from '@lib/common/interfaces/services';
import { ResponseResult } from '@lib/common/types';
import { Member } from '@lib/core/databases/postgres';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { PermissionGuard } from '@lib/utils/middlewares';
import { UserAgentService } from '@lib/utils/modules';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto, LogoutDto, RefreshTokenDto } from './dto';

@Controller('auth')
@ApiTags('Authenticate Service')
export class AuthController {
  private readonly cmd = 'auth.';
  constructor(
    private readonly serviceClient: ServiceProviderBuilder,
    private readonly userAgentService: UserAgentService,
  ) {}

  @Public()
  @Get('health')
  async healthCheck() {
    const pattern: IPatternMessage = { cmd: this.cmd + 'healthCheck' };
    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      {},
      pattern,
    );
  }

  @Public()
  @RoleDecorator(RoleEnv.Admin)
  @UseGuards(PermissionGuard)
  @Post('login')
  async login(
    @Req() request: ICustomRequest,
    @Body() payload: LoginDto,
  ): Promise<ResponseResult<IJwtResponse>> {
    const { validateRoles = [] } = request;
    const { components = {} } = request.fingerprint;
    const ipAddress = request.connection.remoteAddress.split(':').pop();
    const userAgent = request.headers['user-agent'];

    const country = components.geoip.country;

    const { deviceId, parseResult } = this.userAgentService.encodeDevice(
      userAgent,
      ipAddress,
      country,
    );
    const { device } = parseResult;

    const pattern: IPatternMessage = { cmd: this.cmd + 'login' };

    const message: ILoginPayload = {
      validateRoles,
      loginPayload: payload,
      fingerPrint: {
        country,
        deviceId,
        deviceType: device.type,
        userAgent,
        ipAddress: ipAddress === '1' ? localIp : ipAddress,
      },
    };

    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      message,
      pattern,
    );
  }

  @Public()
  @RoleDecorator(RoleEnv.Admin)
  @UseGuards(PermissionGuard)
  @Post('refresh-token')
  async refreshToken(
    @Req() request: ICustomRequest,
    @Body() payload: RefreshTokenDto,
  ): Promise<ResponseResult<boolean>> {
    const { validateRoles = [] } = request;
    const { hash = '' } = request.fingerprint;
    const deviceId = hash;

    const pattern: IPatternMessage = { cmd: this.cmd + 'refreshToken' };
    const message = {
      payload: Object.assign(payload, { deviceId }, { validateRoles }),
    };

    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      message,
      pattern,
    );
  }

  @ApiBearerAuth()
  @Get('session')
  async getSession(@UserDecorator() user: IJwtPayload): Promise<IJwtPayload> {
    return user;
  }

  @ApiBearerAuth()
  @Get('profile')
  async getProfile(
    @UserDecorator() user: IJwtPayload,
  ): Promise<Member | IGatewayError> {
    const pattern: IPatternMessage = { cmd: this.cmd + 'getProfile' };

    const profile = await this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      user.memberId,
      pattern,
    );

    return {
      ...profile,
      session: user,
    };
  }

  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @UserDecorator() user: IJwtPayload,
    @Body() payload: LogoutDto,
  ): Promise<ResponseResult<IMutationResponse>> {
    const pattern: IPatternMessage = { cmd: this.cmd + 'logout' };

    return this.serviceClient.sendMessage(
      ServiceName.AUTH_SERVICE,
      { ...user, deviceId: payload.deviceId },
      pattern,
    );
  }
}
