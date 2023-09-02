import { metaData } from '@lib/common/constants';
import { RoleEnv, ServiceName } from '@lib/common/enums';
import { ICustomRequest } from '@lib/common/interfaces';
import { Role } from '@lib/core/databases/postgres';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly serviceClient: ServiceProviderBuilder,
    private reflector: Reflector,
    private readonly defaultRoles: string[],
  ) {}

  private async validateRequest(
    request: ICustomRequest,
    roles: string[],
  ): Promise<boolean> {
    try {
      const { user } = request;
      const { roleId } = user;

      if (!roleId) return false;

      const message = { id: roleId };
      const pattern = {
        cmd: `${ServiceName.MEMBER_SERVICE}.RoleController.getById`,
      };

      const role: Role = await this.serviceClient.sendMessage(
        ServiceName.MEMBER_SERVICE,
        message,
        pattern,
      );

      if (!role) return false;

      return roles.includes(role.name);
    } catch (e) {
      return null;
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        metaData.isPublic,
        [context.getClass(), context.getHandler()],
      );
      if (isPublic) return true;

      let roles = this.defaultRoles;
      const reflectRole = this.reflector.getAllAndOverride<string[]>(
        metaData.roles,
        [context.getClass(), context.getHandler()],
      );

      if (reflectRole && reflectRole.length > 0) roles = reflectRole;
      if (roles.includes(RoleEnv.All)) return true;

      const request = context.switchToHttp().getRequest();
      const check = await this.validateRequest(request, roles);

      return check;
    } catch (error) {
      console.error(error.message);
      throw new UnauthorizedException();
    }
  }
}
