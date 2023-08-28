import { metaData } from '@lib/common/constants';
import { ServiceName } from '@lib/common/enums';
import { ICustomRequest } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { parseJwtHeader } from '@lib/utils/helpers';
import { JwtStrategy } from '@lib/utils/middlewares/strategy';
import { UserAgentService } from '@lib/utils/modules';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly serviceClient: ServiceProviderBuilder,
    private reflector: Reflector,
    private readonly userAgentService: UserAgentService,
  ) {}

  private async validateRequest(
    request: ICustomRequest,
  ): Promise<IJwtPayload | boolean> {
    const { components = {} } = request.fingerprint;
    const country = components.geoip.country;

    const headers = request.headers;
    const userAgent = headers['user-agent'];
    const ipAddress = request.connection.remoteAddress.split(':').pop();

    const { deviceId: checkDeviceId } = this.userAgentService.encodeDevice(
      userAgent,
      ipAddress,
      country,
    );

    const token = headers['authorization'] || null;
    if (!token) return false;
    const parsedToken = parseJwtHeader(token);

    const jwtPayload: IJwtPayload = JwtStrategy.decode(parsedToken);

    if (process.env.ENV !== 'develop' && checkDeviceId !== jwtPayload.deviceId)
      throw new UnauthorizedException('Token not issued for this device');

    try {
      const secretKey = await this.serviceClient.sendMessage(
        ServiceName.AUTH_SERVICE,
        jwtPayload,
        { cmd: 'auth.getActiveDeviceSession' },
      );

      if (!secretKey) return false;

      return !!JwtStrategy.verify(parsedToken, secretKey)
        ? Object.assign(jwtPayload, { ipAddress })
        : null;
    } catch (e) {
      return null;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        metaData.isPublic,
        [context.getHandler(), context.getClass()],
      );
      if (isPublic) return true;

      const request = context.switchToHttp().getRequest();

      const jwtPayload = await this.validateRequest(request);
      if (!jwtPayload) throw new UnauthorizedException();

      request.user = jwtPayload;

      return true;
    } catch (error) {
      console.error(error.message);
      throw new UnauthorizedException();
    }
  }
}
