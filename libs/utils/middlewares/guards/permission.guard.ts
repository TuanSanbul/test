import { metaData } from '@lib/common/constants';
import { RoleEnv } from '@lib/common/enums';
import { ICustomRequest, IRoleInit } from '@lib/common/interfaces';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const reflectRoles = this.reflector.getAllAndOverride<string[]>(
        metaData.roles,
        [context.getClass(), context.getHandler()],
      );

      if (!reflectRoles || reflectRoles.length <= 0) return true;
      if (reflectRoles && reflectRoles.includes(RoleEnv.All)) return true;

      const roleInit = this.configService.get<IRoleInit>('roleInit');
      const request: ICustomRequest = context.switchToHttp().getRequest();

      request.validateRoles = reflectRoles.map(
        (role) => roleInit[role.toLowerCase()],
      );

      return true;
    } catch (error) {
      console.error(error.message);
      throw new UnauthorizedException();
    }
  }
}
