import { mutationResult } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces/response';
import {
  CommunicateSetting,
  ICommunicateSetting,
} from '@lib/core/databases/mongo';
import { BaseRepository } from '@lib/core/base';
import { LoggerService } from '@lib/utils/modules';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, FilterQuery } from 'mongoose';

@Injectable()
export class NotificationSettingService extends BaseRepository {
  private readonly serviceName: string = NotificationSettingService.name;
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

  async createNotificationSetting(
    payload: Partial<ICommunicateSetting>,
  ): Promise<CommunicateSetting> {
    try {
      const setting = await this.create(
        this.dataSourceMongo,
        CommunicateSetting,
        payload,
      );

      return setting;
    } catch (error) {
      this.logger.error(error?.message);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateNotificationSetting(
    query: FilterQuery<CommunicateSetting>,
    payload: ICommunicateSetting,
  ): Promise<IMutationResponse> {
    try {
      const setting = await this.getOne(
        this.dataSourceMongo,
        CommunicateSetting,
        query,
      );

      if (!setting) throw new NotFoundException('Not found record');

      await this.update(
        this.dataSourceMongo,
        CommunicateSetting,
        query,
        payload,
      );

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getByNotiId(notificationId: string): Promise<CommunicateSetting> {
    try {
      const setting = await this.getOne(
        this.dataSourceMongo,
        CommunicateSetting,
        { notification: notificationId },
      );

      return setting;
    } catch (error) {
      this.logger.error(error?.message);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSettingByIds(ids: string[]): Promise<CommunicateSetting[]> {
    try {
      const settings = await this.getMany(
        this.dataSourceMongo,
        CommunicateSetting,
        { notification: { $in: ids } },
      );

      return settings;
    } catch (error) {
      this.logger.error(error?.message);
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
