import { DbName } from '@lib/common/enums';
import { IFingerPrint } from '@lib/common/interfaces/modules/auth';
import { LoginLog } from '@lib/core/databases/mongo';
import { BaseRepository } from '@lib/core/base';
import { LoggerService } from '@lib/utils/modules';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

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

  async saveLoginLog(
    memberId: string,
    status: boolean,
    fingerPrint: IFingerPrint,
  ): Promise<void> {
    try {
      await this.create(this.dataSourceMongo, LoginLog, {
        ...fingerPrint,
        memberId,
        status,
      });
    } catch (error) {
      this.logger.warn(error?.message);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
