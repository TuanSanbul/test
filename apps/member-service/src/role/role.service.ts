import { DbName } from '@lib/common/enums';
import { Role } from '@lib/core/databases/postgres';
import { BaseRepository } from '@lib/core/base';
import { LoggerService } from '@lib/utils/modules';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { ResponseResult } from '@lib/common/types';
import { GatewayError } from '@lib/utils/middlewares';
import { IQueryMessage } from '@lib/common/interfaces';
import { CacheService } from '@lib/core/caching';
import { roleTTL } from '@lib/common/constants';

@Injectable()
export class RoleService extends BaseRepository {
  private readonly serviceName: string = RoleService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly cacheService: CacheService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getOrCreate(name: string): Promise<Role> {
    try {
      const role = await this.getOne(this.dataSourcePostgres, Role, {
        where: {
          name,
        },
      });

      if (role) return role;

      const newRole = this.createInstance(this.dataSourcePostgres, Role, {
        name,
      });

      await this.create(this.dataSourcePostgres, Role, newRole);

      return newRole;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getById(id: string): Promise<Role> {
    try {
      const funcGetData = () =>
        this.getOne(this.dataSourcePostgres, Role, {
          where: { id },
        });

      const role = await this.cacheService.getOrSet<Role>(
        `role_${id}`,
        funcGetData,
        roleTTL,
      );

      if (!role) throw new NotFoundException('Not found role');

      return role;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getListRole(
    query: IQueryMessage<Role>,
  ): Promise<ResponseResult<Role[]>> {
    try {
      const { size, queryFields } = query;

      const where: FindOptionsWhere<Role> = {};
      for (const key in queryFields) {
        Object.assign(where, { [key]: queryFields[key] });
      }

      const roles = await this.getMany(this.dataSourcePostgres, Role, {
        where,
        take: size,
      });

      return roles;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
