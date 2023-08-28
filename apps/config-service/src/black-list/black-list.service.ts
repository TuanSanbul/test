import { BadRequestException, Injectable } from '@nestjs/common';
import { DbName } from '@lib/common/enums';
import { LoggerService } from '@lib/utils/modules';
import { GatewayError } from '@lib/utils/middlewares';
import { BaseRepository } from '@lib/core/base';
import {
  IBlackListMember,
  IDeleteBlackListIp,
  IUpdateBlackListIp,
} from '@lib/common/interfaces/modules/blacklist';
import { BlackListType } from '@lib/common/enums';
import {
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import { ResponseResult } from '@lib/common/types';
import { mutationResult } from '@lib/common/constants';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, Like } from 'typeorm';
import { BlackList, Member } from '@lib/core/databases/postgres';
import { isEmpty } from 'lodash';

@Injectable()
export class BlackListService extends BaseRepository {
  logger: LoggerService;
  private readonly serviceName: string = BlackListService.name;

  constructor(
    logger: LoggerService,
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getListIp() {
    try {
      const queryResults = await this.getMany(
        this.dataSourcePostgres,
        BlackList,
        { where: { type: BlackListType.Ip }, select: ['ipAddress'] },
      );

      const results = queryResults.map((item) => item.ipAddress);
      return results;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getListMember(
    message: IQueryMessage<BlackList & Member>,
  ): Promise<ResponseResult<IPaginationResponse<BlackList>>> {
    try {
      const { page = 1, size = 10, queryFields } = message;
      const { detail, ...rest } = queryFields;

      const query = this.dataSourcePostgres.manager
        .createQueryBuilder(BlackList, 'bl')
        .leftJoin('bl.member', 'member')
        .select([
          'bl.id AS id',
          'bl.detail AS detail',
          'member.username AS username',
          'member.fullName AS fullName',
          'member.username AS username',
          'member.bankName AS bankName',
          'member.bankAccountNumber AS bankAccountNumber',
          'member.phone AS phone',
        ])
        .where({ type: BlackListType.Member })
        .offset((page - 1) * size)
        .limit(size);

      if (detail) query.andWhere({ detail: Like(`${detail}%`) });

      const memberQuery = {};
      if (!isEmpty(queryFields)) {
        for (const key in rest) {
          memberQuery[key] = Like(`${rest[key]}%`);
        }
        query.andWhere({ member: memberQuery });
      }

      const [results, total] = await Promise.all([
        query.getRawMany(),
        query.getCount(),
      ]);

      return { results, pagination: { total } };
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async addIpAddress(
    message: IUpdateBlackListIp,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { listIp = [] } = message;
      const mapListIp = listIp.map((ipAddress) => ({
        ipAddress,
        type: BlackListType.Ip,
      }));

      await this.upsert(
        this.dataSourcePostgres,
        BlackList,
        ['ipAddress'],
        mapListIp,
      );

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async deleteMember(id: string): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.delete(this.dataSourcePostgres, BlackList, { id });
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async deleteIpAddress(
    message: IDeleteBlackListIp,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { listIp = [] } = message;
      await this.delete(this.dataSourcePostgres, BlackList, {
        ipAddress: In(listIp),
      });

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async addMember(
    message: IBlackListMember,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { memberId } = message;
      const [member, isExist] = await Promise.all([
        this.getOne(this.dataSourcePostgres, Member, {
          where: { id: memberId },
        }),
        this.exist(this.dataSourcePostgres, BlackList, {
          member: { id: memberId },
        }),
      ]);

      if (!member) throw new BadRequestException('Not found member');
      if (isExist) throw new BadRequestException('Already block this member');

      await this.create(this.dataSourcePostgres, BlackList, {
        ...message,
        type: BlackListType.Member,
        member,
      });

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }
}
