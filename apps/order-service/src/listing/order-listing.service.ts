import { DbName } from '@lib/common/enums';
import { IPaginationResponse } from '@lib/common/interfaces';
import { IQueryOrder } from '@lib/common/interfaces/modules/order';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Order } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { OrderQueryService } from './order-query.service';

@Injectable()
export class OrderListingService extends BaseRepository {
  private readonly serviceName: string = OrderListingService.name;
  private readonly logger: LoggerService;
  constructor(
    logger: LoggerService,
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly orderQueryService: OrderQueryService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getListOrder(
    filter: IQueryOrder,
  ): Promise<
    ResponseResult<
      IPaginationResponse<Order> & { totalBet: number; totalResult: number }
    >
  > {
    try {
      const { page = 1, size = 20, orderFields } = filter;
      const query = this.orderQueryService.generateQuery(filter);

      const { totalBet, totalResult } = await this.getSumOrder(query);

      this.orderQueryService.orderQuery(query, orderFields);
      const [results, total = 0] = await query
        .clone()
        .select([
          'order',
          'detail',
          'gameDetail',
          'member.id',
          'member.username',
          'member.money',
          'member.nickName',
          'member.level',
          'member.group',
        ])
        .offset((page - 1) * size)
        .limit(size)
        .getManyAndCount();

      return { results, totalBet, totalResult, pagination: { total } };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getSumOrder(
    query: SelectQueryBuilder<Order>,
  ): Promise<{ totalBet: number; totalResult: number }> {
    try {
      const { totalBet = 0, totalResult = 0 } = await query
        .clone()
        .select('SUM(order.betAmount)', 'totalBet')
        .addSelect('SUM(order.winningMoney)', 'totalResult')
        .getRawOne();

      return { totalBet, totalResult };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
