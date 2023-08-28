import { DbName } from '@lib/common/enums';
import { IPaginationResponse, IQueryMessage } from '@lib/common/interfaces';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { LoginLog } from '@lib/core/databases/mongo';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, FilterQuery } from 'mongoose';

@Injectable()
export class LoginLogService extends BaseRepository {
  private readonly serviceName: string = LoginLogService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getListLogs(
    query: IQueryMessage<LoginLog>,
  ): Promise<ResponseResult<IPaginationResponse<LoginLog>>> {
    try {
      const { page = 1, size = 20, queryFields } = query;

      const where: FilterQuery<LoginLog> = {};
      for (const key in queryFields) {
        Object.assign(where, { [key]: queryFields[key] });
      }

      const logs = await this.getPagination(
        this.dataSourceMongo,
        LoginLog,
        {
          page,
          size,
        },
        where,
      );

      return logs;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
