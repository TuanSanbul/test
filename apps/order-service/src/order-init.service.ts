import { DbName } from '@lib/common/enums';
import { BaseRepository } from '@lib/core/base';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class OrderInitService extends BaseRepository {
  private readonly serviceName: string = OrderInitService.name;
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
}
