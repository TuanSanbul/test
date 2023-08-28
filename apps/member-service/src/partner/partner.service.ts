import { partnerTypeConstant } from '@lib/common/constants';
import { DbName, Sort } from '@lib/common/enums';
import { BaseRepository } from '@lib/core/base';
import { PartnerType } from '@lib/core/databases/mongo';
import { PartnerLog } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty, pick } from 'lodash';
import { Connection } from 'mongoose';
import { DataSource } from 'typeorm';

@Injectable()
export class PartnerService extends BaseRepository {
  private readonly serviceName: string = PartnerService.name;
  private readonly logger: LoggerService;

  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getPartnerSettlement(payload: any) {
    try {
      const {
        page = 1,
        size = 10,
        // startTime = new Date(0),
        // endTime = new Date(),
      } = payload;

      let partnerTypeMap = new Map();
      const partnerType = await this.getOrCreate();

      if (!isEmpty(partnerType))
        partnerTypeMap = new Map(
          partnerType.map((type) => {
            const pickElement = pick(type, ['id', 'level', 'rate']);
            return [type.id, pickElement];
          }),
        );

      const { results = [], pagination } = await this.getPagination(
        this.dataSourcePostgres,
        PartnerLog,
        { page, size },
        {
          where: {},
          order: { lastPayment: Sort.Desc },
        },
      );

      return {
        results: results.map((item) => ({
          ...item,
          partnerType: partnerTypeMap.get(item.partnerTypeId),
        })),
        pagination,
      };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async setPartnerConfig(payload: PartnerLog) {
    const { memberId, partnerTypeId } = payload;

    const entity = await this.upsert(
      this.dataSourcePostgres,
      PartnerLog,
      ['memberId', 'partnerTypeId'],
      {
        memberId,
        partnerTypeId,
      },
    );
    return entity;
  }

  async getOrCreate(): Promise<PartnerType[]> {
    try {
      let partnerType;
      partnerType = await this.getMany(
        this.dataSourceMongo,
        PartnerType,
        null,
        { query: { sort: { order: 1, state: 1, level: 1 } } },
      );
      if (!isEmpty(partnerType)) return partnerType;

      partnerType = await this.create(
        this.dataSourceMongo,
        PartnerType,
        partnerTypeConstant,
      );

      return partnerType;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getListPartnerType() {
    try {
      return this.getOrCreate();
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
