import { DbName, GameFeedType, MarketStatus, Sort } from '@lib/common/enums';
import { IPaginationResponse, IQueryMessage } from '@lib/common/interfaces';
import { IQueryGameDetail } from '@lib/common/interfaces/modules/game';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { TopLeagues } from '@lib/core/databases/mongo';
import { GameDetail, GameFeed } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { Connection } from 'mongoose';
import {
  Between,
  DataSource,
  Equal,
  FindOptionsWhere,
  ILike,
  In,
  MoreThanOrEqual,
} from 'typeorm';

type ResponseGameFeeds = ResponseResult<IPaginationResponse<GameFeed>>;
@Injectable()
export class NewsFeedService extends BaseRepository {
  logger: LoggerService;
  private readonly serviceName: string = NewsFeedService.name;

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

  async getDetailFeed(payload: IQueryGameDetail) {
    try {
      const { gameFeedId } = payload.queryFields;

      const details = await this.getMany(this.dataSourcePostgres, GameDetail, {
        where: { gameFeedId },
        relations: ['market'],
        order: {
          order: Sort.Asc,
          market: { name: Sort.Asc },
          createdAt: Sort.Asc,
        },
      });
      if (isEmpty(details)) throw new NotFoundException();

      const groupedMarket = details.reduce((prev, detail) => {
        const { marketId, order, market, ...rest } = detail;
        if (!prev[marketId])
          prev[marketId] = {
            id: marketId,
            name: market.name,
            nameKo: market.nameKo,
            type: market.type,
            order,
            results: [],
          };

        prev[marketId].results.push(rest);

        return prev;
      }, {});

      return Object.values(groupedMarket);
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getListFeeds(
    payload: IQueryMessage<GameFeed & GameDetail>,
  ): Promise<ResponseGameFeeds> {
    try {
      const {
        page = 1,
        size = 50,
        startTime = new Date(),
        endTime,
        queryFields,
        orderFields,
        customFilter,
      } = payload;
      const skip = (page - 1) * size;

      const timeQuery = { startTime, endTime };

      const where = await this.generateCondition(
        queryFields,
        timeQuery,
        customFilter,
      );
      const orderBy = this.generateOrder(orderFields);

      const [gameFeeds, totalCount] = await this.dataSourcePostgres.manager
        .createQueryBuilder(GameFeed, 'gameFeed')
        .loadRelationCountAndMap('gameFeed.gameDetailCount', 'gameFeed.details')
        .where(where)
        .leftJoinAndSelect('gameFeed.realScore', 'realScore')
        .addSelect([
          'gameFeed.startTime AS startTime',
          'gameFeed.leagueName AS leagueName',
          'gameFeed.nationName AS nationName',
          'gameFeed.homeTeam AS homeTeam',
          'gameFeed.awayTeam AS awayTeam',
        ])
        .orderBy(orderBy)
        .limit(size)
        .offset(skip)
        .getManyAndCount();

      const firstMarketConstants = ['1X2', 'Asian Handicap', 'Total Goals'];
      const ids = gameFeeds.map((game) => game.id);
      const firstDetail = await this.getMany(
        this.dataSourcePostgres,
        GameDetail,
        {
          where: {
            gameFeedId: In(ids),
            market: {
              name: In(firstMarketConstants),
              status: Equal(MarketStatus.Active),
            },
          },
          relations: ['market'],
          order: {
            market: { name: Sort.Asc },
            order: Sort.Asc,
          },
        },
      );

      const groupedDetails = firstDetail.reduce((prev, detail) => {
        if (!prev[detail.gameFeedId]) prev[detail.gameFeedId] = [];
        prev[detail.gameFeedId].push(detail);
        return prev;
      }, {});

      const mappedGames = gameFeeds.map((gameFeed) => ({
        ...gameFeed,
        firstDetail: groupedDetails[gameFeed.id] || [],
      }));

      return {
        results: mappedGames,
        pagination: { total: totalCount },
      };
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  private async generateCondition(
    queryFields: Partial<GameFeed>,
    timeQuery: {
      startTime: Date;
      endTime: Date;
    },
    customFilter: unknown,
  ): Promise<FindOptionsWhere<GameFeed>> {
    const where: FindOptionsWhere<GameFeed> = { type: GameFeedType.InPlay };
    if (customFilter) {
      const topLeagueId = customFilter['topLeagueId'];

      const listTopLeague = await this.getOne(
        this.dataSourceMongo,
        TopLeagues,
        { id: topLeagueId },
      );
      if (listTopLeague) where.leagueName = In(listTopLeague.leagues);
    }

    for (const key in queryFields) {
      Object.assign(where, {
        [key]: ILike(`${queryFields[key]}%`),
      });

      const isId = /id/i; //check if key match [id] to using UUID type
      const FieldWithEnumType = ['type', 'matchStatus', 'eventStatus'];
      if (FieldWithEnumType.includes(key) || isId.test(key)) {
        Object.assign(where, {
          [key]: Equal(queryFields[key]),
        });
      }
    }

    const { startTime, endTime } = timeQuery;
    if (!!startTime || !!endTime) {
      const newStartTime = !!startTime ? startTime : new Date(0);
      const newEndTime = !!endTime ? endTime : null;

      Object.assign(where, {
        startTime: !newEndTime
          ? MoreThanOrEqual(newStartTime)
          : Between(newStartTime, newEndTime),
      });
    }

    return where;
  }

  private generateOrder(
    orderFields: Partial<Record<keyof GameFeed, Sort>>,
  ): Partial<Record<keyof GameFeed, Sort>> {
    const orderBy = {
      startTime: Sort.Asc,
    };

    for (const key in orderFields) {
      Object.assign(orderBy, {
        [key]: orderFields[key],
      });
    }

    return orderBy;
  }
}
