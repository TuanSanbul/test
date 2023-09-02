import { mutationResult } from '@lib/common/constants';
import { DbName, ServiceName } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import {
  IPayloadCreateMember,
  IUpdateConfigMember,
  IUpdateDetailMember,
  IUpdateMultiMember,
} from '@lib/common/interfaces/modules/member';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { CacheService } from '@lib/core/caching';
import { LoginSession, MemberConfig } from '@lib/core/databases/mongo';
import { Member } from '@lib/core/databases/postgres';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { getPattern } from '@lib/utils/helpers';
import { GatewayError } from '@lib/utils/middlewares';
import { CryptoService, LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { Connection } from 'mongoose';
import { DataSource, In } from 'typeorm';
import { GameConfigService } from '../../game-config';
import { RoleService } from '../../role';

@Injectable()
export class MemberMutationService extends BaseRepository {
  private readonly serviceName: string = MemberMutationService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly cryptoService: CryptoService,
    private readonly roleService: RoleService,
    private readonly gameConfigService: GameConfigService,
    private readonly cacheService: CacheService,
    private readonly serviceClient: ServiceProviderBuilder,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async updateMultiMember(
    actorLevel: number,
    payload: IUpdateMultiMember[],
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      if (!actorLevel) throw new ForbiddenException();

      const checkPermission = payload.some((mem) => {
        if (!mem.level) return true;
        return mem.level > actorLevel;
      });

      if (checkPermission)
        throw new ForbiddenException(
          'Cannot modify level which above your level',
        );

      const { memberIds, memberMap } = payload.reduce(
        (prev, member) => {
          const { memberIds, memberMap } = prev;
          memberIds.push(member.id);
          memberMap.set(member.id, member);
          return prev;
        },
        {
          memberIds: [],
          memberMap: new Map<string, IUpdateMultiMember>(),
        },
      );

      const members = await this.getMany(this.dataSourcePostgres, Member, {
        where: { id: In(memberIds) },
      });

      await this.dataSourcePostgres.manager.save(
        Member,
        members.map((member) => ({
          ...member,
          ...memberMap.get(member.id),
        })),
      );

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateConfigMember(
    id: string,
    payload: Partial<IUpdateConfigMember>,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      let { password } = payload;
      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { id },
      });

      if (!member) throw new NotFoundException('Not found member');

      password = password
        ? this.cryptoService.computeSHA1OfMD5(password)
        : member.password;

      await this.dataSourcePostgres.manager.save(Member, {
        ...member,
        ...payload,
        password,
      });

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateDetailMember(
    id: string,
    payload: Partial<IUpdateDetailMember>,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      let { password, exchangePassword } = payload;
      const { role: roleUpdate, actorLevel, level, ...rest } = payload;

      if (!actorLevel) throw new ForbiddenException();

      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { id },
        relations: { role: true },
      });

      if (!member) throw new NotFoundException('Not found member');

      if (level && level > actorLevel)
        throw new ForbiddenException(
          'Cannot modify level which above your level',
        );

      const role = roleUpdate
        ? await this.roleService.getById(roleUpdate)
        : member.role;

      [password, exchangePassword] = [
        password
          ? this.cryptoService.computeSHA1OfMD5(password)
          : member.password,
        exchangePassword
          ? this.cryptoService.computeSHA1OfMD5(exchangePassword)
          : member.exchangePassword,
      ];

      await this.dataSourcePostgres.manager.save(Member, {
        ...member,
        ...rest,
        role,
        password,
        exchangePassword,
        level: level || member.level,
      });

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getMemberConfig(): Promise<MemberConfig> {
    try {
      const pattern = {
        cmd: getPattern(
          [ServiceName.CONFIG_SERVICE, 'BasicSettingController'],
          'getMemberConfig',
        ),
      };
      const config = await this.serviceClient.sendMessage(
        ServiceName.CONFIG_SERVICE,
        {},
        pattern,
      );

      return config;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMember(
    payload: Partial<IPayloadCreateMember>,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      let { password, exchangePassword } = payload;
      const { username, nickName, role: roleId, ...rest } = payload;

      const [checkExistedAccount, config] = await Promise.all([
        this.getMany(this.dataSourcePostgres, Member, {
          where: [{ username }, { nickName }],
        }),
        this.getMemberConfig(),
      ]);

      if (!config) throw new NotFoundException('Not found config');
      if (checkExistedAccount.length > 0)
        throw new BadRequestException('Username or Nickname existed');

      [password, exchangePassword] = [
        this.cryptoService.computeSHA1OfMD5(password),
        this.cryptoService.computeSHA1OfMD5(exchangePassword),
      ];

      const role = await this.roleService.getById(
        roleId || config.memberRegisterRole,
      );

      const newMember = this.createInstance(this.dataSourcePostgres, Member, {
        ...rest,
        role,
        username,
        nickName,
        password,
        exchangePassword,
        level: config.memberRegisterLevel,
        group: config.memberRegisterGroup,
      });

      await this.dataSourcePostgres.manager.save(Member, newMember);
      await Promise.all([
        this.gameConfigService.initGameConfig(newMember),
        this.gameConfigService.initGameTypes(newMember),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async logoutMember(
    memberId: string,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const loginSessions = await this.getMany<LoginSession>(
        this.dataSourceMongo,
        LoginSession,
        { memberId },
      );

      if (loginSessions && loginSessions.length <= 0)
        throw new BadRequestException('User has not login');

      await Promise.all([
        this.cacheService.delete(
          loginSessions.map(
            (session) => `${session.memberId}_${session.deviceId}`,
          ),
        ),
        this.delete(this.dataSourceMongo, LoginSession, {
          memberId,
        }),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
