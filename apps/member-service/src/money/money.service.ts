import {
  DbName,
  MoneyLogSource,
  MoneyLogStatus,
  Sort,
} from '@lib/common/enums';
import { IPaginationResponse } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import { IMoneyInsert } from '@lib/common/interfaces/modules/money';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member, MoneyLog } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import {
  Between,
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  ILike,
} from 'typeorm';

type ResponseCalculate = {
  sumOrder: number;
  sumWin: number;
  sumSystem: number;
  sumLoss: number;
};
@Injectable()
export class MoneyService extends BaseRepository {
  private readonly serviceName: string = MoneyService.name;
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
    payload: any,
  ): Promise<
    ResponseResult<
      IPaginationResponse<MoneyLog> & { calculateResult: ResponseCalculate }
    >
  > {
    try {
      const {
        page = 1,
        size = 10,
        startTime = new Date(0),
        endTime = new Date(),
        queryFields,
        orderFields,
      } = payload;
      const orderBy = { ['moneyLog.createdAt']: Sort.Desc };

      const where: FindManyOptions<MoneyLog> = {};
      const baseQuery = this.dataSourcePostgres.manager
        .createQueryBuilder(MoneyLog, 'moneyLog')
        .leftJoinAndSelect('moneyLog.member', 'member')
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

      const subQuery = (type: MoneyLogSource) =>
        baseQuery
          .clone()
          .select('COALESCE(SUM(moneyLog.money), 0)')
          .where(`moneyLog.source = '${type}'`)
          .getQuery();

      const [
        [results = [], total = 0],
        calculateResult = { loss: 0, order: 0, system: 0, win: 0 },
      ] = await Promise.all([
        baseQuery
          .clone()
          .select([
            'moneyLog.id',
            'moneyLog.reason',
            'moneyLog.createdAt',
            'moneyLog.money',
            'moneyLog.moneyTotal',
            'member.id',
            'member.nickName',
            'member.username',
            'member.fullName',
            'member.level',
            'member.group',
          ])
          .offset((page - 1) * size)
          .limit(size)
          .orderBy(orderBy)
          .getManyAndCount(),
        baseQuery
          .clone()
          .select([
            `( ${subQuery(MoneyLogSource.Win)} ) AS win`,
            `( ${subQuery(MoneyLogSource.Loss)} ) AS loss`,
            `( ${subQuery(MoneyLogSource.Order)} ) AS order`,
            `( ${subQuery(MoneyLogSource.System)} ) AS system`,
          ])
          .getRawOne(),
      ]);

      return {
        results,
        pagination: { total },
        calculateResult: {
          sumLoss: Number(calculateResult.loss),
          sumOrder: Number(calculateResult.order),
          sumSystem: Number(calculateResult.system),
          sumWin: Number(calculateResult.win),
        },
      };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async insertMoney(
    payload: IMoneyInsert,
    request: IJwtPayload,
  ): Promise<ResponseResult<MoneyLog>> {
    try {
      const { memberId, username, amount, reason, source } = payload;

      const where: FindOptionsWhere<Member> = memberId
        ? { id: memberId }
        : { username };

      const memberInfo = await this.getOne(this.dataSourcePostgres, Member, {
        where,
        select: ['id', 'money'],
      });
      if (!memberInfo) throw new NotFoundException();

      let moneyTotal = Number(memberInfo.money) + amount;
      if (moneyTotal < 0) moneyTotal = 0;

      const moneyLogEntity: MoneyLog = {
        money: amount,
        moneyTotal,
        reason,
        source: source ? source : MoneyLogSource.System,
        status: MoneyLogStatus.Success,
        memberId: memberInfo.id,
        actionId: request?.memberId || this.EMPTY_ACTION_ID,
      };

      const entityMoneyLog = this.createInstance(
        this.dataSourcePostgres,
        MoneyLog,
        moneyLogEntity,
      );

      await Promise.all([
        this.update(
          this.dataSourcePostgres,
          Member,
          { username },
          { money: moneyTotal },
        ),
        this.insertLog(request.memberId, entityMoneyLog),
      ]);
      return entityMoneyLog;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async insertLog(
    requestId: string,
    moneyLog: MoneyLog,
  ): Promise<ResponseResult<MoneyLog>> {
    try {
      const moneyLogEntity: MoneyLog = {
        ...moneyLog,
        actionId: requestId,
      };
      return this.create(this.dataSourcePostgres, MoneyLog, moneyLogEntity);
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
