import { CoinLogSource, CoinLogStatus, DbName, Sort } from '@lib/common/enums';
import { IPaginationResponse } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { CoinLogQuery, ICoinInsert } from '@lib/common/interfaces/modules/coin';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { CoinLog, Member } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { Between, DataSource, FindManyOptions, ILike } from 'typeorm';

@Injectable()
export class CoinService extends BaseRepository {
  private readonly serviceName: string = CoinService.name;
  private readonly logger: LoggerService;
  private readonly EMPTY_ACTION_ID = 'Anonymous';

  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getList(
    payload: CoinLogQuery,
  ): Promise<
    ResponseResult<IPaginationResponse<CoinLog> & { summary: { sum: number } }>
  > {
    try {
      const {
        page,
        size,
        startTime = new Date(0),
        endTime = new Date(),
        queryFields,
        orderFields,
      } = payload;

      const orderBy = { ['coinLog.createdAt']: Sort.Desc };
      const where: FindManyOptions<CoinLog> = {};

      const baseQuery = this.dataSourcePostgres.manager
        .createQueryBuilder(CoinLog, 'coinLog')
        .leftJoinAndSelect('coinLog.member', 'member')
        .where({ createdAt: Between(startTime, endTime) });

      if (!isEmpty(queryFields)) {
        for (const key in queryFields) {
          const existKeyMember = this.checkKeyExistInEntity(
            this.dataSourcePostgres,
            Member,
            key,
          );
          if (existKeyMember) {
            where['member'] = { [key]: ILike(`${queryFields[key]}%`) };
          } else {
            where[key] = ILike(`${queryFields[key]}%`);
          }
        }
      }

      if (!isEmpty(orderFields)) {
        for (const key in orderFields) {
          const existKeyMember = this.checkKeyExistInEntity(
            this.dataSourcePostgres,
            Member,
            key,
          );
          if (existKeyMember) {
            orderBy['member'] = { [key]: orderFields[key] };
          } else {
            orderBy[key] = orderFields[key];
          }
        }
      }

      baseQuery.andWhere(where);
      const [[results = [], total = 0], calculateResult = { sum: 0 }] =
        await Promise.all([
          baseQuery
            .clone()
            .select([
              'coinLog.id',
              'coinLog.reason',
              'coinLog.createdAt',
              'coinLog.coin',
              'coinLog.coinTotal',
              'member.id',
              'member.nickName',
              'member.fullName',
              'member.level',
              'member.group',
            ])
            .offset((page - 1) * size)
            .limit(size)
            .orderBy(orderBy)
            .getManyAndCount(),
          baseQuery.clone().select('SUM(coinLog.coin)', 'sum').getRawOne(),
        ]);

      return {
        results,
        pagination: { total },
        summary: { sum: Number(calculateResult.sum) },
      };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async insertCoin(
    request: IJwtPayload,
    payload: ICoinInsert,
  ): Promise<ResponseResult<CoinLog>> {
    try {
      const { username, amount, reason } = payload;
      const memberInfo = await this.getOne(this.dataSourcePostgres, Member, {
        where: { username },
        select: ['id', 'coin'],
      });
      if (!memberInfo) throw new NotFoundException();

      let coinTotal = Number(memberInfo.coin) + amount;
      if (coinTotal < 0) coinTotal = 0;

      const coinLogEntity: CoinLog = {
        source: CoinLogSource.System,
        status: CoinLogStatus.Success,
        coin: amount,
        coinTotal,
        reason,
        ...payload,
        memberId: memberInfo.id,
        actionId: request?.memberId || this.EMPTY_ACTION_ID,
      };

      const entityCoinLog = this.createInstance(
        this.dataSourcePostgres,
        CoinLog,
        coinLogEntity,
      );

      await Promise.all([
        this.update(
          this.dataSourcePostgres,
          Member,
          { username },
          { coin: coinTotal },
        ),
        this.insertLog(request, entityCoinLog),
      ]);
      return entityCoinLog;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async insertLog(
    request: IJwtPayload,
    log: Partial<CoinLog>,
  ): Promise<ResponseResult<CoinLog>> {
    try {
      const coinLog: CoinLog = {
        memberId: log.memberId,
        coin: log.coin,
        coinTotal: log.coinTotal,
        reason: log.reason,
        source: log.source || CoinLogSource.System,
        status: log.status || CoinLogStatus.Pending,
        actionId: request.memberId,
      };
      const coinInstance = this.createInstance(
        this.dataSourcePostgres,
        CoinLog,
        coinLog,
      );

      return this.create(this.dataSourcePostgres, CoinLog, coinInstance);
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
