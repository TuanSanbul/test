import { DateDigit } from '@lib/common/enums';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { addTime, convertDateToSecond } from '@lib/utils/helpers';
import * as jwt from 'jsonwebtoken';

export class JwtStrategy {
  expiredPeriod: number;
  expiredDigit: DateDigit;
  constructor(expiredPeriod: number, expiredDigit: DateDigit) {
    this.expiredPeriod = expiredPeriod;
    this.expiredDigit = expiredDigit;
  }

  generate(payload: object, secretKey: string): string {
    return jwt.sign(
      {
        ...payload,
        exp: convertDateToSecond(
          addTime(this.expiredPeriod, this.expiredDigit),
        ),
      },
      secretKey,
    );
  }

  static decode(token: string): IJwtPayload {
    return jwt.decode(token) as IJwtPayload;
  }

  static verify(token: string, secretKeyJwt: string) {
    return jwt.verify(token, secretKeyJwt, { ignoreExpiration: false });
  }
}
