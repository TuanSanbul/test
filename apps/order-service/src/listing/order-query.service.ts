import { DbName, Sort } from '@lib/common/enums';
import {
  IOrderFieldsOrder,
  IQueryOrder,
} from '@lib/common/interfaces/modules/order';
import { BaseRepository } from '@lib/core/base';
import { Order } from '@lib/core/databases/postgres';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { DataSource, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class OrderQueryService extends BaseRepository {
  private readonly serviceName: string = OrderQueryService.name;
  private readonly logger: LoggerService;
  constructor(
    logger: LoggerService,
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly configService: ConfigService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  generateFilterWhere(
    query: SelectQueryBuilder<Order>,
    object: object,
    alias?: string,
  ) {
    for (const key in object) {
      if (object[key] === null || object[key] === undefined) continue;
      if (
        typeof object[key] === 'string' &&
        key !== 'state' &&
        !key.toLowerCase().includes('id')
      ) {
        query.andWhere(`${alias}.${key} LIKE '${object[key]}%'`);
      } else {
        query.andWhere(`${alias}.${key} = '${object[key]}'`);
      }
    }
  }

  generateQuery(filter: IQueryOrder): SelectQueryBuilder<Order> {
    const {
      startTime = moment(new Date(0)).utc().toISOString(),
      endTime = moment(new Date()).utc().toISOString(),
      queryFields,
    } = filter;

    const {
      orderDetailResult,
      orderState,
      isAdmin,
      marketId,
      username,
      nickName,
      ipAddress,
      orderCode,
      homeTeamName,
      awayTeamName,
      leagueName,
      gameFeedId,
      gameId,
      gameCategoryId,
      isInterested,
    } = queryFields;

    const orderFields = {
      ipAddress,
      code: orderCode,
      state: orderState,
    };

    const orderDetailsFields = {
      result: orderDetailResult,
    };

    const gameDetailFields = {
      gameId,
      marketId,
      homeTeamName,
      awayTeamName,
    };

    const gameFeedFields = {
      leagueName,
      fid: gameFeedId,
    };

    const memberFields = {
      username,
      nickName,
      isInterested,
    };

    const query = this.dataSourcePostgres
      .createQueryBuilder(Order, 'order')
      .leftJoinAndSelect('order.details', 'detail')
      .leftJoinAndSelect('detail.gameDetail', 'gameDetail')
      .innerJoinAndSelect('order.member', 'member')
      .where('order.createdAt BETWEEN :startTime AND :endTime', {
        startTime,
        endTime,
      });

    if (gameCategoryId) {
      query
        .leftJoinAndSelect('detail.gameCategory', 'category')
        .andWhere('category.id = :gameCategoryId', { gameCategoryId });
    }

    if (isAdmin) {
      const adminRole = this.configService.get<string>('roleInit.admin');
      query
        .innerJoinAndSelect('member.role', 'role')
        .andWhere('role.name = :adminRole', { adminRole });
    }

    if (!isEmpty(orderFields))
      this.generateFilterWhere(query, orderFields, 'order');

    if (!isEmpty(orderDetailsFields))
      this.generateFilterWhere(query, orderDetailsFields, 'detail');

    if (!isEmpty(gameDetailFields))
      this.generateFilterWhere(query, gameDetailFields, 'gameDetail');

    if (!isEmpty(memberFields))
      this.generateFilterWhere(query, memberFields, 'member');

    if (!isEmpty(gameFeedFields)) {
      query.leftJoinAndSelect('gameDetail.gameFeed', 'gameFeed');
      this.generateFilterWhere(query, gameFeedFields, 'gameFeed');
    }

    return query;
  }

  async orderQuery(
    query: SelectQueryBuilder<Order>,
    orderFields: IOrderFieldsOrder,
  ) {
    let order = {};
    if (!isEmpty(orderFields)) {
      for (const key in orderFields) {
        Object.assign(order, { [`order.${key}`]: orderFields[key] });
      }
    } else {
      order = { 'order.id': Sort.Desc };
    }
    query.orderBy(order);
  }
}
