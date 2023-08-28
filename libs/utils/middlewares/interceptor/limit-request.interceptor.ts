import { IRequestLimit } from '@lib/common/interfaces';
import { UserAgentService } from '@lib/utils/modules';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RateLimiterInterceptor implements NestInterceptor {
  private readonly limit: number;
  private readonly time: number;

  private readonly tokens: Map<string, { count: number; lastRefill: number }>;

  constructor(
    requestLimitConfig: IRequestLimit,
    private readonly userAgentService: UserAgentService,
  ) {
    const { time, limit } = requestLimitConfig;

    this.limit = limit;
    this.time = time * 1000; // convert to second
    this.tokens = new Map();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const ipAddress = request.connection.remoteAddress.split(':').pop();

    const headers = request.headers;
    const { components = {} } = request.fingerprint;
    const country = components.geoip.country;
    const userAgent = headers['user-agent'];
    const { deviceId, parseResult } = this.userAgentService.encodeDevice(
      userAgent,
      ipAddress,
      country,
    );

    const { os, browser } = parseResult;

    let hashKeyRequest;
    if (!request.user?.memberId) {
      hashKeyRequest = [browser.name, os.name, ipAddress, deviceId].join('_');
    } else {
      hashKeyRequest = [
        browser.name,
        os.name,
        ipAddress,
        request.user?.memberId,
      ].join('_');
    }

    this.refillTokens(hashKeyRequest);

    if (!this.hasEnoughTokens(hashKeyRequest))
      throw new HttpException(
        { message: 'Too Many Requests' },
        HttpStatus.TOO_MANY_REQUESTS,
      );

    if (this.tokens.has(hashKeyRequest)) {
      const tokenInfo = this.tokens.get(hashKeyRequest);
      tokenInfo.count -= 1;
    }

    return next.handle();
  }

  private refillTokens(key: string): void {
    const now = Date.now();

    if (!this.tokens.has(key))
      this.tokens.set(key, { count: this.limit, lastRefill: now });

    const tokenInfo = this.tokens.get(key);
    const elapsed = now - tokenInfo.lastRefill;

    const tokensToAdd = Math.floor(elapsed / this.time) * this.limit;
    const newTokens = Math.min(tokenInfo.count + tokensToAdd, this.limit);

    tokenInfo.count = newTokens;
    tokenInfo.lastRefill = now;
  }

  private hasEnoughTokens(key: string): boolean {
    if (!this.tokens.has(key)) return true;

    return this.tokens.get(key).count > 0;
  }
}
