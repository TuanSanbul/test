import { mutationResult } from '@lib/common/constants';
import { DbName, MarketConfigStatus, Sort } from '@lib/common/enums';
import {
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import {
  IUpdateListMarket,
  IUpdateMarket,
} from '@lib/common/interfaces/modules/market';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { MarketConfig } from '@lib/core/databases/mongo';
import { Market } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, In } from 'typeorm';
import { isEmpty } from 'lodash';

@Injectable()
export class MarketService extends BaseRepository {
  logger: LoggerService;
  private readonly serviceName: string = MarketService.name;
  private readonly selectField = {
    id: true,
    name: true,
    nameKo: true,
    order: true,
    status: true,
    type: true,
    score: true,
    marketConfigId: true,
  };

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

  async getList(
    query: IQueryMessage<Market>,
  ): Promise<ResponseResult<IPaginationResponse<Market>>> {
    try {
      const { page = 1, size = 10, queryFields, orderFields } = query;

      const queryList: FindOptionsWhere<Market> = {};
      const { type, ...rest } = queryFields;
      if (type) Object.assign(queryList, { type });

      if (isEmpty(orderFields))
        Object.assign(orderFields, { createdAt: Sort.Desc });

      for (const key in rest) {
        queryList[key] =
          typeof rest[key] == 'string' ? ILike(`${rest[key]}%`) : rest[key];
      }

      const results = await this.getPagination(
        this.dataSourcePostgres,
        Market,
        { page, size },
        {
          where: queryList,
          order: orderFields,
          select: this.selectField,
        },
      );

      return results;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getMarketConfig(): Promise<ResponseResult<MarketConfig[]>> {
    try {
      const result = await this.getMany(
        this.dataSourceMongo,
        MarketConfig,
        { status: MarketConfigStatus.Active },
        {
          projection: {
            id: true,
            name: true,
            nameKo: true,
            status: true,
          },
        },
      );

      return result;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async createMarket(
    payload: Partial<Market>,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.create(this.dataSourcePostgres, Market, payload);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateMarket(
    payload: Partial<Market>,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { id } = payload;
      await this.update(this.dataSourcePostgres, Market, { id }, payload);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateListMarket(
    payload: IUpdateListMarket,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { market = [] } = payload;

      const { ids, map } = market.reduce(
        (prev, market) => {
          const { ids, map } = prev;
          const { id } = market;
          ids.push(id);
          map.set(id, market);
          return prev;
        },
        {
          ids: [],
          map: new Map<string, IUpdateMarket>(),
        },
      );

      const listMarket = await this.getMany(this.dataSourcePostgres, Market, {
        where: { id: In(ids) },
      });

      const updatedMarket: Market[] = listMarket.map((item) =>
        this.createInstance(this.dataSourcePostgres, Market, {
          ...item,
          ...map.get(item.id),
        }),
      );

      await this.dataSourcePostgres.manager.save<Market>(updatedMarket);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getDetail(id: string): Promise<ResponseResult<Market>> {
    try {
      const market = this.getOne(this.dataSourcePostgres, Market, {
        where: { id },
        select: this.selectField,
      });

      return market;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
