import { mutationResult } from '@lib/common/constants';
import { DateDigit, DbName } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import {
  IFingerPrint,
  IJwtPayload,
  IJwtResponse,
  ILoginPayload,
} from '@lib/common/interfaces/modules/auth';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { CacheService } from '@lib/core/caching';
import { ILoginSession, LoginSession } from '@lib/core/databases/mongo';
import { Member } from '@lib/core/databases/postgres';
import { addTime, convertDateToSecond, dateDiff } from '@lib/utils/helpers';
import { GatewayError, JwtStrategy } from '@lib/utils/middlewares';
import { CryptoService, LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Connection } from 'mongoose';
import * as randomatic from 'randomatic';
import { DataSource } from 'typeorm';
import { LoginLogService } from '../login-log';

@Injectable()
export class SessionService extends BaseRepository {
  private readonly serviceName: string = SessionService.name;
  private readonly logger: LoggerService;
  private jwtService: JwtStrategy;

  private jwtSecretExpirePeriod = 1;
  private jwtSecretExpireDigit: DateDigit = DateDigit.Day;
  private jwtRefreshSecretExpirePeriod = 7;
  private jwtRefreshSecretExpireDigit: DateDigit = DateDigit.Day;

  constructor(
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly cryptoService: CryptoService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly loginLogService: LoginLogService,
    logger: LoggerService,
  ) {
    super();

    this.logger = logger;
    this.logger.setContext(this.serviceName);

    this.getConfigJwt();
  }

  getConfigJwt() {
    const jwtConfig = this.configService.get<object>('jwt');

    for (const key in jwtConfig) {
      let value = jwtConfig[key];
      if (key.includes('Period')) value = Number(value);
      this[key] = value;
    }

    this.jwtService = new JwtStrategy(
      this.jwtSecretExpirePeriod,
      this.jwtSecretExpireDigit,
    );
  }

  async login(payload: ILoginPayload): Promise<ResponseResult<IJwtResponse>> {
    try {
      const { loginPayload, fingerPrint, validateRoles } = payload;
      if (isEmpty(loginPayload)) throw new BadRequestException();

      const { username, password } = loginPayload;
      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { username },
        select: ['id', 'username', 'password', 'level', 'exchangePassword'],
        relations: { role: true },
      });

      if (!member) throw new UnauthorizedException();
      if (!member.role) throw new ForbiddenException();
      if (validateRoles.length > 0 && !validateRoles.includes(member.role.name))
        throw new ForbiddenException();

      const loginStatus = this.cryptoService.verify(password, member.password);
      const [jwtResponse = null] = await Promise.all([
        loginStatus && this.handleDeviceSession(member, fingerPrint),
        this.loginLogService.saveLoginLog(member.id, loginStatus, fingerPrint),
        this.update(
          this.dataSourcePostgres,
          Member,
          { id: member.id },
          {
            lastAccess: moment().utc().toISOString(),
            lastLoginIP: fingerPrint.ipAddress,
          },
        ),
      ]);

      if (!loginStatus) throw new UnauthorizedException();

      return jwtResponse;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async logout(
    payload: IJwtPayload,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { deviceId, memberId } = payload;
      const loginSession = await this.getOne<LoginSession>(
        this.dataSourceMongo,
        LoginSession,
        {
          memberId,
          deviceId,
        },
      );

      if (!loginSession) throw new ForbiddenException();

      await Promise.all([
        this.cacheService.delete(`${memberId}_${deviceId}`),
        this.delete(this.dataSourceMongo, LoginSession, {
          id: loginSession.id,
        }),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  generateToken(
    payload: IJwtPayload,
  ): IJwtResponse & { secretKey: string; expiredDate: Date } {
    const secretKey = randomatic('A0', 10);
    const refreshExpiredDate = addTime(
      this.jwtRefreshSecretExpirePeriod,
      this.jwtRefreshSecretExpireDigit,
    );
    const accessExpiredDate = addTime(
      this.jwtSecretExpirePeriod,
      this.jwtSecretExpireDigit,
    );

    const [accessToken, refreshToken] = [
      this.jwtService.generate(payload, secretKey),
      randomatic('Aa0', 64),
    ];

    return {
      secretKey,
      accessToken,
      refreshToken,
      expiredDate: refreshExpiredDate,
      accessExpiredAt: convertDateToSecond(accessExpiredDate),
      refreshExpiredAt: convertDateToSecond(refreshExpiredDate),
    };
  }

  async refreshToken(
    deviceId: string,
    refreshToken: string,
    validateRoles: string[],
  ): Promise<ResponseResult<IJwtResponse>> {
    try {
      const loginSession = await this.getOne<LoginSession>(
        this.dataSourceMongo,
        LoginSession,
        {
          deviceId,
          refreshToken,
          expiredAt: { $gte: new Date() },
        },
      );

      if (!loginSession)
        throw new UnauthorizedException('Refresh token invalid');

      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { id: loginSession.memberId },
        select: {
          id: true,
          level: true,
        },
        relations: { role: true },
      });

      if (!member) throw new NotFoundException('Not found member');
      if (!member.role) throw new ForbiddenException();
      if (validateRoles.length > 0 && !validateRoles.includes(member.role.name))
        throw new ForbiddenException();

      const { role = null, id, level } = member;
      const payload: IJwtPayload = {
        deviceId,
        memberId: id,
        memberLevel: level,
        roleId: role.id,
      };

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessExpiredAt,
        refreshExpiredAt,
        secretKey,
        expiredDate,
      } = this.generateToken(payload);

      await Promise.all([
        this.cacheService.set(
          `${member.id}_${deviceId}`,
          secretKey,
          dateDiff(new Date(), expiredDate, 'seconds'),
        ),
        this.update(
          this.dataSourceMongo,
          LoginSession,
          { id: loginSession.id },
          {
            secretKey,
            refreshToken: newRefreshToken,
            expiredAt: expiredDate,
          },
        ),
      ]);

      return {
        refreshExpiredAt,
        accessExpiredAt,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async handleDeviceSession(
    member: Partial<Member>,
    metadata: IFingerPrint,
  ): Promise<IJwtResponse> {
    try {
      const { deviceId } = metadata;
      const { id, level, role = null } = member;

      const deviceSession = await this.getOne<ILoginSession>(
        this.dataSourceMongo,
        LoginSession,
        {
          memberId: id,
          deviceId,
        },
      );

      const payload: IJwtPayload = {
        deviceId,
        memberLevel: level,
        memberId: id,
        roleId: role ? role.id : null,
      };

      const {
        accessToken,
        refreshToken,
        accessExpiredAt,
        refreshExpiredAt,
        secretKey,
        expiredDate,
      } = this.generateToken(payload);

      const mutationData = {
        secretKey,
        refreshToken,
        expiredAt: expiredDate,
      };

      const mutationDeviceSession = deviceSession
        ? {
            ...metadata,
            ...mutationData,
          }
        : {
            ...metadata,
            ...mutationData,
            memberId: id,
          };

      await Promise.all([
        this.cacheService.set(
          `${member.id}_${deviceId}`,
          secretKey,
          dateDiff(new Date(), expiredDate, 'seconds'),
        ),
        deviceSession
          ? this.update(
              this.dataSourceMongo,
              LoginSession,
              { id: deviceSession.id },
              mutationDeviceSession,
            )
          : this.create(
              this.dataSourceMongo,
              LoginSession,
              mutationDeviceSession,
            ),
      ]);

      return {
        accessToken,
        refreshToken,
        accessExpiredAt,
        refreshExpiredAt,
      };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getActiveDeviceSession(payload: IJwtPayload): Promise<string | null> {
    try {
      const { deviceId, memberId, exp } = payload;
      const keyCache = `${memberId}_${deviceId}`;
      const secretKeyFromCache = await this.cacheService.get(keyCache);
      if (secretKeyFromCache) return secretKeyFromCache;

      const [member, loginSession] = await Promise.all([
        this.getOne(this.dataSourcePostgres, Member, {
          where: { id: memberId },
          select: { id: true },
        }),
        this.getOne<LoginSession>(this.dataSourceMongo, LoginSession, {
          deviceId,
          memberId,
        }),
      ]);

      if (member.id !== memberId) return null;
      if (!loginSession) return null;

      await this.cacheService.set(
        keyCache,
        loginSession.secretKey,
        (exp - Math.floor(Date.now() / 1000)) * 1000,
      );

      return loginSession ? loginSession.secretKey : null;
    } catch (error) {
      this.logger.error(error.message);
      return null;
    }
  }
}
