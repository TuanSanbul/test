import { mutationResult } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import { EGameTypeConfig } from '@lib/common/enums/game-type-config.enum';
import { IMutationResponse } from '@lib/common/interfaces';
import {
  IGameConfig,
  IGameAmount,
  IUpdateGameConfig,
} from '@lib/common/interfaces/modules/game-config';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { GameTypeConfig } from '@lib/core/databases/mongo';
import { GameCategory, GameType } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { mapKeys } from 'lodash';
import { Connection } from 'mongoose';
import { DataSource } from 'typeorm';

@Injectable()
export class GameConfigService extends BaseRepository {
  logger: LoggerService;
  private readonly serviceName: string = GameConfigService.name;

  constructor(
    logger: LoggerService,
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getGameConfig() {
    try {
      const listGameConfig = await this.getMany(
        this.dataSourcePostgres,
        GameCategory,
        {
          relations: { gameType: true },
          select: {
            name: true,
            gameType: {
              id: true,
              name: true,
              nameKo: true,
              order: true,
              isActive: true,
              isAutoResult: true,
              isAutoRegistration: true,
              gameCategoryId: true,
            },
          },
        },
      );

      const mapResults = listGameConfig.reduce((prev, item) => {
        const { gameType } = item;
        const convertGameType = gameType.map((gameTypeItem) => ({
          ...gameTypeItem,
          order: +gameTypeItem.order,
        }));
        item.gameType = convertGameType;

        Object.assign(prev, { [item.name]: item.gameType });
        return prev;
      }, {});

      return mapResults;
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async createGameConfig(
    payload: IGameConfig,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      let listGameType: GameType[] = [];
      const { gameTypes, name } = payload;
      const newGameCategory = await this.create(
        this.dataSourcePostgres,
        GameCategory,
        { name },
      );

      listGameType = gameTypes.map((gameType) =>
        this.createInstance<GameType>(
          this.dataSourcePostgres,
          GameType,
          Object.assign(gameType, { gameCategory: newGameCategory }),
        ),
      );

      await this.dataSourcePostgres.manager.save<GameType>(listGameType);

      return mutationResult;
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateGameConfig(
    payload: IUpdateGameConfig,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { data = [] } = payload;

      const listGameType: GameType[] = data.map((gameType) =>
        this.createInstance<GameType>(
          this.dataSourcePostgres,
          GameType,
          gameType,
        ),
      );

      await this.dataSourcePostgres.manager.save<GameType>(listGameType);

      return mutationResult;
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async createGameCategory(
    name: string,
  ): Promise<ResponseResult<GameCategory>> {
    try {
      const gameCategory = await this.create(
        this.dataSourcePostgres,
        GameCategory,
        { name },
      );
      return gameCategory;
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async createGameType(name: string): Promise<ResponseResult<GameCategory>> {
    try {
      const gameCategory = await this.create(
        this.dataSourcePostgres,
        GameCategory,
        { name },
      );
      return gameCategory;
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getGameCategories(): Promise<ResponseResult<GameCategory[]>> {
    try {
      const gameCategories = await this.getMany(
        this.dataSourcePostgres,
        GameCategory,
        {
          relations: { gameType: true },
          select: {
            id: true,
            name: true,
            gameType: {
              id: true,
              name: true,
              nameKo: true,
              order: true,
              isActive: true,
              isAutoResult: true,
              isAutoRegistration: true,
            },
          },
        },
      );
      return gameCategories;
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getGameAmountConfig() {
    try {
      const listGameType = await this.getMany(
        this.dataSourcePostgres,
        GameType,
        {},
      );

      const listId = listGameType.map((item) => item.id);

      const listGameTypeConfig = await this.getMany(
        this.dataSourceMongo,
        GameTypeConfig,
        { gameTypeId: { $in: listId } },
      );

      type GameTypeMap = Record<string, Partial<GameType>>;
      const gameTypeMap: GameTypeMap = mapKeys(listGameType, 'id');

      const results = listGameTypeConfig.reduce((prev, item) => {
        const { level, maxWinning, maxBet, type, gameTypeId } = item;

        const mappedItem = prev.get(gameTypeId) || {
          id: gameTypeMap[gameTypeId]?.id,
          name: gameTypeMap[gameTypeId]?.name,
          nameKo: gameTypeMap[gameTypeId]?.nameKo,
        };

        const { key, value } = {
          [EGameTypeConfig.maxBet]: {
            key: EGameTypeConfig.maxBet + level,
            value: maxBet,
          },
          [EGameTypeConfig.maxWinning]: {
            key: EGameTypeConfig.maxWinning + level,
            value: maxWinning,
          },
        }[type];
        Object.assign(mappedItem, { [key]: value });

        prev.set(gameTypeId, mappedItem);

        return prev;
      }, new Map());

      return Array.from(results.values());
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateGameAmountConfig(
    payload: IGameAmount[],
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const data = this.formatRequest(payload);

      const bulkOps = data.map((doc) => ({
        updateOne: {
          filter: {
            gameTypeId: doc.gameTypeId,
            level: doc.level,
            type: doc.type,
          },
          update: { $set: doc },
          upsert: true,
        },
      }));

      const model = this.dataSourceMongo.models[GameTypeConfig.name];
      await model.bulkWrite(bulkOps);

      return mutationResult;
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  formatRequest(data: IGameAmount[]) {
    const formatData = data.flatMap((item) => {
      const { id, ...rest } = item;
      return Object.keys(rest).map((key) => {
        let maxWinning = 0;
        let maxBet = 0;
        let type: EGameTypeConfig;
        let level = 0;

        if (key.startsWith(EGameTypeConfig.maxBet)) {
          level = +key.replace(EGameTypeConfig.maxBet, '');
          maxBet = +rest[key];
          type = EGameTypeConfig.maxBet;
        } else if (key.startsWith(EGameTypeConfig.maxWinning)) {
          level = +key.replace(EGameTypeConfig.maxWinning, '');
          maxWinning = +rest[key];
          type = EGameTypeConfig.maxWinning;
        }
        return {
          gameTypeId: id,
          type,
          level,
          maxBet,
          maxWinning,
        };
      });
    });
    return formatData;
  }
}
