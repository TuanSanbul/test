import { TopLeaguesInit } from '@lib/common/constants';
import {
  DbName,
  GameFeedType,
  LeagueStatus,
  NationStatus,
  Sort,
} from '@lib/common/enums';
import { SportStatus } from '@lib/common/enums/sport.enum';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { TopLeagues } from '@lib/core/databases/mongo';
import {
  GameDetail,
  GameFeed,
  League,
  Nation,
  Sport,
  Team,
} from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { Connection } from 'mongoose';
import { DataSource, Equal, ILike, In, MoreThanOrEqual } from 'typeorm';

export class GameService extends BaseRepository {
  logger: LoggerService;
  private readonly serviceName: string = GameService.name;

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

  async getOrCreateTopLeagues(): Promise<TopLeagues[]> {
    try {
      let topLeagues = [];
      topLeagues = await this.getMany(this.dataSourceMongo, TopLeagues, null, {
        projection: {
          id: 1,
          name: 1,
          nameKo: 1,
          order: 1,
          leagues: 1,
          imageUrl: 1,
        },
        query: { sort: { order: 1 } },
      });

      if (!isEmpty(topLeagues)) return topLeagues;

      topLeagues = await this.insertMany(
        this.dataSourceMongo,
        TopLeagues,
        TopLeaguesInit,
      );

      return topLeagues;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTopLeagues() {
    const constantMenu = await this.getOrCreateTopLeagues();
    return constantMenu ?? [];
  }

  async getTreeMenu(searchTerm: string) {
    const startTime = new Date();

    const query = this.dataSourcePostgres.manager
      .createQueryBuilder(GameFeed, 'gameFeed')
      .leftJoinAndSelect('gameFeed.sport', 'sport')
      .leftJoinAndSelect('gameFeed.nation', 'nation')
      .leftJoinAndSelect('gameFeed.league', 'league')
      .orderBy({
        sportOrder: Sort.Asc,
        nationOrder: Sort.Asc,
        leagueOrder: Sort.Asc,
      })
      .select([
        'DISTINCT gameFeed.fid',

        'gameFeed.sportId AS "sportId" ',
        'gameFeed.sportName AS "sportName" ',
        'sport.nameKo AS "sportNameKo" ',
        'sport.order AS sportOrder',
        'sport.imageUrl AS "sportImageUrl"',

        'gameFeed.nationId AS "nationId" ',
        'gameFeed.nationName AS "nationName" ',
        'nation.nameKo AS "nationNameKo" ',
        'nation.order AS nationOrder ',
        'nation.imageUrl AS "nationImageUrl"',

        'gameFeed.leagueId AS "leagueId" ',
        'gameFeed.leagueName AS "leagueName" ',
        'league.nameKo AS "leagueNameKo" ',
        'league.order AS leagueOrder ',
      ])
      .where({
        type: Equal(GameFeedType.PreMatch),
        startTime: MoreThanOrEqual(startTime),
      });
    if (searchTerm) query.andWhere({ leagueName: ILike(`${searchTerm}%`) });

    const resultGameFeed = await query.getRawMany();
    const groupedData: any[] = [];

    resultGameFeed.forEach((item) => {
      const sportId = item.sportId;
      const sportName = item.sportName;
      const nationName = item.nationName;

      const league = {
        leagueId: item.leagueId,
        leagueName: item.leagueName,
        leagueNameKo: item.leagueNameKo,
        matchCount: 1,
      };

      let sport = groupedData.find((s) => s.sportName === sportName);
      if (!sport) {
        sport = {
          sportId,
          sportName,
          sportNameKo: item.sportNameKo,
          nations: [],
          nationCount: 0,
          imageUrl: item.sportImageUrl,
        };
        groupedData.push(sport);
      }

      let nation = sport.nations.find((n) => n.nationName === nationName);
      if (!nation) {
        nation = {
          nationId: item.nationId,
          nationName,
          nationNameKo: item.nationNameKo,
          leagues: [],
          leagueCount: 1,
          imageUrl: item.nationImageUrl,
        };
        sport.nations.push(nation);
      } else {
        nation.leagueCount++;
      }

      const existingLeague = nation.leagues.find(
        (l) => l.leagueName === item.leagueName,
      );
      if (existingLeague) {
        existingLeague.matchCount++;
      } else {
        league.matchCount = 1;
        nation.leagues.push(league);
      }

      sport.nationCount++;
    });

    return groupedData;
  }

  async getNations() {
    try {
      return this.getMany(this.dataSourcePostgres, Nation, {
        where: { status: NationStatus.Active },
      });
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getTeams() {
    try {
      return this.getMany(this.dataSourcePostgres, Team, {
        where: { status: NationStatus.Active },
      });
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getLeagues() {
    try {
      return this.getMany(this.dataSourcePostgres, League, {
        where: { status: LeagueStatus.Active },
      });
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getSports() {
    try {
      return this.getMany(this.dataSourcePostgres, Sport, {
        where: { status: SportStatus.Active },
      });
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getGameDetail(ids: string[]): Promise<ResponseResult<GameDetail[]>> {
    try {
      const gameDetails = await this.getMany(
        this.dataSourcePostgres,
        GameDetail,
        { where: { id: In(ids) } },
      );

      return gameDetails;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }
}
