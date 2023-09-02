import { DbName } from '@lib/common/enums';
import { ResponseResult } from '@lib/common/types';
import { Member } from '@lib/core/databases/postgres';
import { BaseRepository } from '@lib/core/base';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

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

  async getProfile(memberId: string): Promise<ResponseResult<Member>> {
    try {
      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { id: memberId },
      });

      return member;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
