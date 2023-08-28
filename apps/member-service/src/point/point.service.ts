import {
  DbName,
  PointSource,
  PointStatus,
  PointType,
  Sort,
} from '@lib/common/enums';
import { IPaginationResponse } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import {
  IPointInsert,
  PointLogQuery,
} from '@lib/common/interfaces/modules/point';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member, PointLog } from '@lib/core/databases/postgres';
import { isNegative } from '@lib/utils/helpers';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { Between, DataSource, FindManyOptions, ILike } from 'typeorm';

@Injectable()
export class PointService extends BaseRepository {
  private readonly serviceName: string = PointService.name;
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
    payload: PointLogQuery,
  ): Promise<
    ResponseResult<IPaginationResponse<PointLog> & { summary: { sum: number } }>
  > {
    try {
      const {
        page = 1,
        size = 10,
        startTime = new Date(0),
        endTime = new Date(),
        queryFields,
        orderFields,
        filterBy,
      } = payload;
      const { roleId, type } = filterBy;

      const orderBy = { ['pointLog.createdAt']: Sort.Desc };
      const where: FindManyOptions<PointLog> = {};

      const baseQuery = this.dataSourcePostgres.manager
        .createQueryBuilder(PointLog, 'pointLog')
        .leftJoinAndSelect('pointLog.member', 'member')
        .where({ createdAt: Between(startTime, endTime) });

      if (type) baseQuery.andWhere({ type });

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

      if (!isEmpty(roleId)) where['member'] = { role: roleId };

      baseQuery.andWhere(where);
      const [[results = [], total = 0], calculateResult = { sum: 0 }] =
        await Promise.all([
          baseQuery
            .clone()
            .select([
              'pointLog.id',
              'pointLog.reason',
              'pointLog.createdAt',
              'pointLog.point',
              'pointLog.pointTotal',
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
          baseQuery.clone().select('SUM(pointLog.point)', 'sum').getRawOne(),
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

  async insertPoint(
    payload: IPointInsert,
    request: IJwtPayload,
  ): Promise<ResponseResult<PointLog>> {
    try {
      const { username, amount, reason } = payload;
      const memberInfo = await this.getOne(this.dataSourcePostgres, Member, {
        where: { username },
        select: ['id', 'point'],
      });
      if (!memberInfo) throw new NotFoundException();

      let pointTotal = Number(memberInfo.point) + amount;
      const pointType = isNegative(amount)
        ? PointType.Negative
        : PointType.Positive;

      if (pointTotal < 0) pointTotal = 0;

      const pointLogEntity = {
        point: amount,
        reason,
        type: pointType,
        source: PointSource.System,
        status: PointStatus.Success,
        pointTotal,
        memberId: memberInfo.id,
        actionId: request?.memberId || this.EMPTY_ACTION_ID,
      };

      const entityPointLog = this.createInstance(
        this.dataSourcePostgres,
        PointLog,
        pointLogEntity,
      );

      await Promise.all([
        this.update(
          this.dataSourcePostgres,
          Member,
          { username },
          { point: pointTotal },
        ),
        this.insertLog(request.memberId, entityPointLog),
      ]);
      return entityPointLog;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async insertLog(
    requestId: string,
    pointLog: PointLog,
  ): Promise<ResponseResult<PointLog>> {
    try {
      const pointLogEntity = {
        ...pointLog,
        actionId: requestId,
      };
      return this.create(this.dataSourcePostgres, PointLog, pointLogEntity);
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
