import { DbName } from '@lib/common/enums';
import { IQueryMessage } from '@lib/common/interfaces';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, ILike, In } from 'typeorm';

@Injectable()
export class ProfileService extends BaseRepository {
  private readonly serviceName: string = ProfileService.name;
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

  async getMembers(
    payload: IQueryMessage<Member>,
  ): Promise<ResponseResult<Member[]>> {
    try {
      const { size = 20, queryFields } = payload;
      const { id, ...rest } = queryFields;
      const where = {};
      for (const key in rest) {
        const operator =
          typeof rest[key] === 'string' ? ILike(`%${rest[key]}`) : rest[key];

        Object.assign(where, { [key]: operator });
      }

      if (id) Object.assign(where, { id });

      const results = await this.getMany(this.dataSourcePostgres, Member, {
        where,
        select: [
          'id',
          'username',
          'phone',
          'bankName',
          'bankAccountNumber',
          'fullName',
          'nickName',
        ],
        take: size,
      });

      return results;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getByIds(ids: string[]): Promise<ResponseResult<Member[]>> {
    try {
      const idSet = [...new Set(ids)];
      const members = await this.dataSourcePostgres.manager.find(Member, {
        where: { id: In(idSet) },
        select: {
          id: true,
          level: true,
          nickName: true,
          username: true,
        },
      });

      return members;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
