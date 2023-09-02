import { DbName, Sort } from '@lib/common/enums';
import { IPaginationResponse } from '@lib/common/interfaces';
import { IQueryMemberIP } from '@lib/common/interfaces/modules/member';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { DataSource, FindOptionsOrder, FindOptionsWhere, ILike } from 'typeorm';

@Injectable()
export class MemberIPService extends BaseRepository {
  private readonly serviceName: string = MemberIPService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getListIP(
    filter: IQueryMemberIP,
  ): Promise<ResponseResult<IPaginationResponse<Member>>> {
    try {
      const { page = 1, size = 20, queryFields, orderFields } = filter;
      const { lastLoginIP } = queryFields;

      const where: FindOptionsWhere<Member> = {};
      if (lastLoginIP)
        Object.assign(where, { lastLoginIP: ILike(`${lastLoginIP}%`) });

      const order: FindOptionsOrder<Member> = {};
      if (!isEmpty(orderFields)) {
        for (const key in orderFields) {
          Object.assign(order, { [key]: orderFields[key] });
        }
      } else {
        Object.assign(order, { lastAccess: Sort.Desc });
      }

      const records = this.getPagination(
        this.dataSourcePostgres,
        Member,
        { page, size },
        {
          select: [
            'id',
            'group',
            'username',
            'nickName',
            'level',
            'lastAccess',
            'lastLoginIP',
          ],
          where,
          order,
        },
      );

      return records;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
