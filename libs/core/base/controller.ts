import { ServiceName } from '../../common';
import { getPattern } from '../../utils';

export class BaseGatewayController {
  readonly className: string;
  readonly serviceName: ServiceName;

  constructor(className: string, serviceName: ServiceName) {
    this.className = className;
    this.serviceName = serviceName;
  }

  protected prefixCmd(functionName: string) {
    const prefix = [this.serviceName, this.className];
    return getPattern(prefix, functionName);
  }
}
