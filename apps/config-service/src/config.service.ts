import { DbName } from '@lib/common/enums';
import { BaseRepository } from '@lib/core/base';
import { Bank } from '@lib/core/databases/mongo';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class ConfigService extends BaseRepository {
  logger: LoggerService;
  private readonly serviceName: string = ConfigService.name;

  constructor(
    logger: LoggerService,
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getListBank() {
    try {
      const results = await this.getMany(
        this.dataSourceMongo,
        Bank,
        { state: true },
        {
          projection: {
            id: true,
            nameKo: true,
          },
        },
      );

      return results;
    } catch (error) {
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
