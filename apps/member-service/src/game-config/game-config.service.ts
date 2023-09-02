import { initMemberGameConfig, mutationResult } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import {
  IPayloadMemberGameConfig,
  IPayloadMemberGameType,
  IPayloadUpdateGameType,
  IPayloadUpdateMemberGameConfig,
} from '@lib/common/interfaces/modules/member';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import {
  GameType,
  Member,
  MemberGameConfig,
  MemberGameType,
} from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { DataSource, In } from 'typeorm';

@Injectable()
export class GameConfigService extends BaseRepository {
  private readonly serviceName: string = GameConfigService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly configService: ConfigService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getGameConfig(memberId: string): Promise<ResponseResult<Member>> {
    try {
      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { id: memberId },
        select: {
          id: true,
          username: true,
          memberGameTypes: true,
          gameConfig: true,
        },
        relations: {
          memberGameTypes: true,
          gameConfig: true,
        },
      });

      if (!member) throw new NotFoundException('Not found member');

      return member;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateMemberGameConfig(
    memberId: string,
    payload: IPayloadUpdateMemberGameConfig,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const member = await this.exist(this.dataSourcePostgres, Member, {
        id: memberId,
      });

      if (!member) throw new NotFoundException('Not found member');

      const { gameTypeConfigs, id: gameConfigId, ...rest } = payload;

      if (!isEmpty(gameTypeConfigs))
        await this.updateGameTypes(gameTypeConfigs);

      if (gameConfigId && !isEmpty(rest))
        await this.updateGameConfig(gameConfigId, rest);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async initGameConfig(
    member: Member,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const checkExists = await this.exist(
        this.dataSourcePostgres,
        MemberGameConfig,
        {
          where: { member: { id: member.id } },
        },
      );

      if (checkExists) return mutationResult;

      const configInstance = this.createInstance(
        this.dataSourcePostgres,
        MemberGameConfig,
        { ...initMemberGameConfig, member },
      );

      await this.create(
        this.dataSourcePostgres,
        MemberGameConfig,
        configInstance,
      );

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async initGameTypes(
    member: Member,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const listGameTypes = await this.getMany(
        this.dataSourcePostgres,
        GameType,
        {
          where: { isAutoRegistration: true },
        },
      );

      if (listGameTypes && listGameTypes.length <= 0) return mutationResult;

      const listGameTypeConfig = listGameTypes.map((gameType) =>
        this.createInstance(this.dataSourcePostgres, MemberGameType, {
          gameType,
          member,
        }),
      );

      await this.dataSourcePostgres.manager.save(
        MemberGameType,
        listGameTypeConfig,
      );

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async createGameTypeConfig(
    payload: IPayloadMemberGameType,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { memberId, gameTypeId, ...rest } = payload;

      const [member, gameType] = await Promise.all([
        this.getOne(this.dataSourcePostgres, Member, {
          where: { id: memberId },
        }),
        this.getOne(this.dataSourcePostgres, GameType, {
          where: { id: gameTypeId },
        }),
      ]);

      if (!member || !gameType)
        throw new NotFoundException('Not found member or game type');

      const gameTypeConfig = this.createInstance(
        this.dataSourcePostgres,
        MemberGameType,
        {
          ...rest,
          member,
          gameType,
        },
      );

      await this.create(
        this.dataSourcePostgres,
        MemberGameType,
        gameTypeConfig,
      );

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateGameConfig(
    gameConfigId: string,
    payload: Partial<IPayloadMemberGameConfig>,
  ) {
    try {
      const config = await this.getOne(
        this.dataSourcePostgres,
        MemberGameConfig,
        {
          where: { id: gameConfigId },
        },
      );

      await this.dataSourcePostgres.manager.save(
        Object.assign(config, payload),
      );

      return mutationResult;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateGameTypes(
    payload: Partial<IPayloadUpdateGameType[]>,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { ids, map } = payload.reduce(
        (prev, config) => {
          const { ids, map } = prev;
          ids.push(config.id);
          map.set(config.id, config);

          return prev;
        },
        {
          ids: [],
          map: new Map<string, IPayloadUpdateGameType>(),
        },
      );

      const listConfig = await this.getMany(
        this.dataSourcePostgres,
        MemberGameType,
        { where: { id: In(ids) } },
      );

      await this.dataSourcePostgres.manager.save(
        listConfig.map((config) => Object.assign(config, map.get(config.id))),
      );

      return mutationResult;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
