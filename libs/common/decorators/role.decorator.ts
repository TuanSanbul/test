import { SetMetadata } from '@nestjs/common';
import { metaData } from '../constants';

export const RoleDecorator = (...roles: string[]) =>
  SetMetadata(metaData.roles, roles);
