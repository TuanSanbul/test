import { mutationResult } from '@lib/common/constants';
import { DbName, ServiceName } from '@lib/common/enums';
import { IMutationResponse, IPaginationResponse } from '@lib/common/interfaces';
import {
  ICreatePostMessage,
  IQueryPostMessage,
} from '@lib/common/interfaces/modules/communicate';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member, PostMessage } from '@lib/core/databases/postgres';
import { ServiceProviderBuilder } from '@lib/core/message-handler';
import { getPattern } from '@lib/utils/helpers';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import {
  DataSource,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  In,
} from 'typeorm';

@Injectable()
export class PostMessageService extends BaseRepository {
  private readonly serviceName: string = PostMessageService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly serviceClient: ServiceProviderBuilder,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async checkMembers(ids: string[]): Promise<Map<string, Member>> {
    try {
      const pattern = {
        cmd: getPattern(
          [ServiceName.MEMBER_SERVICE, 'ProfileController'],
          'getByIds',
        ),
      };
      const message = { payload: { ids } };
      const members = await this.serviceClient.sendMessage(
        ServiceName.MEMBER_SERVICE,
        message,
        pattern,
      );

      return members.reduce((prev, member) => {
        prev.set(member.id, member);
        return prev;
      }, new Map());
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateCondition(query: IQueryPostMessage): FindOptionsWhere<PostMessage> {
    const { queryFields } = query;

    const where: FindOptionsWhere<PostMessage> = { receiver: {} };
    for (const key in queryFields) {
      const checkKey = this.checkKeyExistInEntity(
        this.dataSourcePostgres,
        PostMessage,
        key,
      );

      Object.assign(checkKey ? where : where.receiver, {
        [key]: ILike(`${queryFields[key]}%`),
      });
    }

    if (isEmpty(where.receiver)) delete where.receiver;

    return where;
  }

  generateOrder(query: IQueryPostMessage): FindOptionsOrder<PostMessage> {
    const { orderFields } = query;

    const orderOptions: FindOptionsOrder<PostMessage> = { receiver: {} };
    for (const key in orderFields) {
      const checkKey = this.checkKeyExistInEntity(
        this.dataSourcePostgres,
        PostMessage,
        key,
      );

      Object.assign(checkKey ? orderOptions : orderOptions.receiver, {
        [key]: orderFields[key],
      });
    }

    if (isEmpty(orderOptions.receiver)) delete orderOptions.receiver;

    return orderOptions;
  }

  async getListMessage(
    query: IQueryPostMessage,
  ): Promise<ResponseResult<IPaginationResponse<PostMessage>>> {
    try {
      const { page = 1, size = 20 } = query;

      const where = this.generateCondition(query);
      const order = this.generateOrder(query);

      const messages = await this.getPagination(
        this.dataSourcePostgres,
        PostMessage,
        { page, size },
        {
          where,
          order,
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            confirmDate: true,
            receiver: {
              id: true,
              username: true,
              level: true,
              group: true,
              nickName: true,
            },
          },
          relations: {
            receiver: true,
          },
        },
      );

      return messages;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async createMessage(
    payload: ICreatePostMessage,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { sender, receivers, ...rest } = payload;

      if (receivers.length <= 0)
        throw new BadRequestException('Empty receivers');

      const idSet = new Set([sender, ...receivers]);
      const memberIds = [...idSet];
      const memberList = await this.checkMembers(memberIds);

      if (idSet.size !== memberList.size)
        throw new BadGatewayException('Invalid member');

      await this.dataSourcePostgres.manager.insert(
        PostMessage,
        receivers.map((receiver) =>
          this.createInstance(this.dataSourcePostgres, PostMessage, {
            ...rest,
            receiver: memberList.get(receiver),
            sender: memberList.get(sender),
          }),
        ),
      );

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateMessage(
    id: string,
    payload: Partial<PostMessage>,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { sender, confirmDate } = payload;
      if (sender)
        throw new BadRequestException('Cannot modify sender or receiver');

      const message = await this.getOne(this.dataSourcePostgres, PostMessage, {
        id,
      });

      if (!message) throw new NotFoundException('Not found record');
      if (confirmDate && message.confirmDate !== null)
        throw new BadRequestException(
          'Message had been read before. Cannot override read day',
        );

      await this.update(this.dataSourcePostgres, PostMessage, { id }, payload);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getOneMessage(id: string): Promise<ResponseResult<PostMessage>> {
    try {
      const message = await this.getOne(this.dataSourcePostgres, PostMessage, {
        where: { id },
      });

      if (!message) throw new NotFoundException('Not found record');

      return message;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async deleteMessage(
    ids: string[],
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.softDelete(this.dataSourcePostgres, PostMessage, {
        id: In(ids),
      });
      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
