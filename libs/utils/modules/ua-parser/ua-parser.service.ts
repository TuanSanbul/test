import { Injectable } from '@nestjs/common';
import * as UAParser from 'ua-parser-js';
import { CryptoService } from '../crypto';
import {
  IEncodeDeviceResult,
  IUserAgentParser,
} from '@lib/common/interfaces/modules/user-agent';
import { DeviceType } from '@lib/common/enums';

@Injectable()
export class UserAgentService {
  private parser: UAParser;

  constructor(private readonly cryptoService: CryptoService) {
    this.parser = new UAParser();
  }

  parseUserAgent(userAgentString: string): IUserAgentParser {
    const parseResult = this.parser.setUA(userAgentString).getResult();
    const { device } = parseResult;
    const { type } = device;

    if (!type) Object.assign(parseResult.device, { type: DeviceType.desktop });
    return parseResult as IUserAgentParser;
  }

  encodeDevice(
    userAgent: string,
    ipAddress: string,
    country: string,
  ): IEncodeDeviceResult {
    const parseResult: IUserAgentParser = this.parseUserAgent(userAgent);

    const parseString = JSON.stringify(
      Object.assign(parseResult, ipAddress, country),
    );

    const deviceId = this.cryptoService.computeSHA1OfMD5(parseString);

    return { deviceId, parseResult };
  }
}
