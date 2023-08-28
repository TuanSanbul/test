import { mutationResult } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import {
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import { ResponseResult } from '@lib/common/types';
import {
  CommunicateTemplate,
  ICommunicateTemplate,
} from '@lib/core/databases/mongo';
import { BaseRepository } from '@lib/core/base';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import { Connection, FilterQuery } from 'mongoose';

@Injectable()
export class TemplateService extends BaseRepository {
  private readonly serviceName: string = TemplateService.name;
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

  async createTemplate(
    payload: ICommunicateTemplate,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.create(this.dataSourceMongo, CommunicateTemplate, payload);
      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateTemplate(
    id: string,
    payload: ICommunicateTemplate,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.update(
        this.dataSourceMongo,
        CommunicateTemplate,
        { id },
        payload,
      );

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getOneTemplate(
    id: string,
  ): Promise<ResponseResult<CommunicateTemplate>> {
    try {
      const template = await this.getOne(
        this.dataSourceMongo,
        CommunicateTemplate,
        { id },
        { projection: { _id: false } },
      );

      if (!template) throw new NotFoundException('Not found template');

      return template;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getListTemplate(
    query: IQueryMessage<CommunicateTemplate>,
  ): Promise<ResponseResult<IPaginationResponse<CommunicateTemplate>>> {
    try {
      const { page = 1, size = 20, queryFields } = query;
      const { title, ...rest } = queryFields;

      const where: FilterQuery<CommunicateTemplate> = {};
      if (title) Object.assign(where, { title: { $regex: `${title}.*` } });

      if (!isEmpty(queryFields)) {
        for (const key in rest) {
          Object.assign(where, { [key]: rest[key] });
        }
      }

      const templates = await this.getPagination(
        this.dataSourceMongo,
        CommunicateTemplate,
        { page, size },
        where,
        {
          projection: {
            title: true,
            createdAt: true,
            id: true,
            content: true,
            type: true,
            _id: false,
          },
        },
      );

      return templates;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async deleteTemplate(id: string): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.delete(this.dataSourceMongo, CommunicateTemplate, { id });

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
