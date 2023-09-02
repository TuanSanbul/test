import { IJwtPayload } from '../modules/auth';

export interface ICustomRequest extends Request {
  fingerprint?: any;
  connection?: any;
  user: IJwtPayload;
  validateRoles?: string[];
}
