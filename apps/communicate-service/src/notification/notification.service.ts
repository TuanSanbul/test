import { mutationResult, relatedMemberInfo } from '@lib/common/constants';
import {
  CommunicateEnum,
  DbName,
  DepositState,
  Sort,
  WithdrawalState,
} from '@lib/common/enums';
import {
  ICommunication,
  IGetDetailNotification,
  IQueryCommunicate,
} from '@lib/common/interfaces/modules/communicate';
import { IQueryMessage } from '@lib/common/interfaces/request';
import {
  IMutationResponse,
  IPaginationResponse,
} from '@lib/common/interfaces/response';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import {
  CommunicateSetting,
  ICommunicateSetting,
} from '@lib/core/databases/mongo';
import {
  Communicate,
  Deposit,
  Member,
  Withdrawal,
} from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import {
  Between,
  DataSource,
  EntityTarget,
  In,
  IsNull,
  Like,
  SelectQueryBuilder,
} from 'typeorm';
import { NotificationSettingService } from '../setting';

@Injectable()
export class NotificationService extends BaseRepository {
  private readonly serviceName: string = NotificationService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly settingService: NotificationSettingService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  generateQuery(
    message: IQueryMessage<IQueryCommunicate>,
  ): SelectQueryBuilder<Communicate> {
    const {
      startTime = moment(new Date(0)).utc().startOf('date').toDate(),
      endTime = moment(new Date()).utc().endOf('date').toDate(),
      queryFields,
      orderFields,
    } = message;
    const { nickName, username, type, deleted, ...restQuery } = queryFields;

    const query = this.dataSourcePostgres.manager
      .createQueryBuilder(Communicate, 'cm')
      .leftJoinAndSelect('cm.parent', 'parent')
      .innerJoinAndSelect('cm.author', 'author')
      .loadRelationCountAndMap('cm.childCount', 'cm.children', 'childCount')
      .select([
        'cm.*',
        'author.id AS "authorId"',
        'author.nickName AS "nickName"',
        'author.level AS level',
        'author.group AS group',
      ])
      .where({ parent: IsNull(), applyDate: Between(startTime, endTime) })
      .andWhere({ type })
      .clone();

    if (username)
      query.andWhere({ author: { username: Like(`${username}%`) } });
    if (nickName)
      query.andWhere({ author: { nickName: Like(`${nickName}%`) } });

    if (!isEmpty(queryFields)) {
      for (const key in restQuery) {
        query.andWhere({ [key]: Like(`${restQuery[key]}%`) });
      }
    }

    let orderBy = {};
    if (!isEmpty(orderFields)) {
      for (const field in orderFields) {
        Object.assign(orderBy, { [`cm.${field}`]: orderFields[field] });
      }
    } else {
      orderBy = { 'cm.id': Sort.Desc };
    }

    if (deleted) query.withDeleted();

    return query.orderBy(orderBy);
  }

  countMoney<T>(entity: EntityTarget<T>, alias: string): string {
    const check = entity === Deposit;
    const field = check ? 'depositCount' : 'withdrawCount';
    const stateEnum = check ? DepositState : WithdrawalState;

    const query = this.dataSourcePostgres.manager
      .createQueryBuilder(entity, alias)
      .select(`COUNT(*)`, field)
      .where(
        `${alias}.memberId = author.id AND ${alias}.state = '${stateEnum.Approve}'`,
      );

    return query.getQuery();
  }

  sumMoney<T>(entity: EntityTarget<T>, alias: string): string {
    const check = entity === Deposit;
    const field = check ? 'total' : 'amount';
    const stateEnum = check ? DepositState : WithdrawalState;

    const query = this.dataSourcePostgres.manager
      .createQueryBuilder(entity, alias)
      .select(`SUM(${alias}.${field})`, `${alias}Sum`)
      .where(
        `${alias}.memberId = author.id AND ${alias}.state = '${stateEnum.Approve}'`,
      );

    return query.getQuery();
  }

  async getListCustomer(
    filter: IQueryMessage<IQueryCommunicate>,
    query: SelectQueryBuilder<Communicate>,
  ): Promise<ResponseResult<IPaginationResponse<Communicate>>> {
    try {
      const { page = 1, size = 20 } = filter;
      query
        .addSelect(
          `(${this.countMoney(Withdrawal, 'withdraw')})`,
          'withdrawCount',
        )
        .addSelect(`(${this.countMoney(Deposit, 'deposit')})`, 'depositCount')
        .addSelect(
          `((${this.sumMoney(Deposit, 'deposit')}) - (${this.sumMoney(
            Withdrawal,
            'withdraw',
          )}))`,
          'revenue',
        );

      const [results, total = 0] = await Promise.all([
        query
          .clone()
          .offset((page - 1) * size)
          .limit(size)
          .getRawMany(),
        query.getCount(),
      ]);

      return {
        results: results.map((record) => {
          const {
            nickName,
            group,
            level,
            authorId,
            withdrawCount,
            depositCount,
            revenue,
            ...rest
          } = record;

          return {
            ...rest,
            revenue: Number(revenue || 0),
            depositCount: Number(depositCount || 0),
            withdrawCount: Number(withdrawCount || 0),
            author: {
              nickName,
              group,
              level,
              authorId,
            },
          };
        }),
        pagination: { total },
      };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getListPopup(
    records: Communicate[],
    total: number,
  ): Promise<ResponseResult<IPaginationResponse<Communicate>>> {
    try {
      const recordIds = records.map((e) => e.id);
      const settings = await this.settingService.getSettingByIds(recordIds);
      const settingMap = settings.reduce((map, setting) => {
        map.set(setting.notification, setting);
        return map;
      }, new Map<string, CommunicateSetting>());

      return {
        results: records.map((record) =>
          Object.assign(record, { setting: settingMap.get(record.id) }),
        ),
        pagination: { total },
      };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getList(
    query: IQueryMessage<IQueryCommunicate>,
  ): Promise<ResponseResult<IPaginationResponse<Communicate>>> {
    try {
      const { page = 1, size = 20, queryFields } = query;
      const { type } = queryFields;

      const queryBuilder = this.generateQuery(query);

      if (type === CommunicateEnum.Customer) {
        const responseData = await this.getListCustomer(query, queryBuilder);
        return responseData;
      }

      const [results = [], total = 0] = await Promise.all([
        queryBuilder
          .clone()
          .offset((page - 1) * size)
          .limit(size)
          .getRawMany(),
        queryBuilder.clone().getCount(),
      ]);

      if (type === CommunicateEnum.Popup) {
        const responseData = await this.getListPopup(results, total);
        return responseData;
      }

      return { results, pagination: { total } };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getOneById(
    payload: IGetDetailNotification,
  ): Promise<ResponseResult<Communicate & { setting: CommunicateSetting }>> {
    try {
      const selectFields = {
        id: true,
        createdAt: true,
        title: true,
        content: true,
        fileUrl: true,
        status: true,
        applyDate: true,
        author: relatedMemberInfo,
      };

      const { id, page, size } = payload;

      const [notification, setting] = await Promise.all([
        this.getOne(this.dataSourcePostgres, Communicate, {
          where: { id },
          relations: { author: true, children: true },
          select: selectFields,
        }),
        this.settingService.getByNotiId(id),
      ]);

      if (!notification) throw new NotFoundException('Not found record');

      const comments = await this.getMany(
        this.dataSourcePostgres,
        Communicate,
        {
          where: { parent: { id } },
          skip: (page - 1) * size,
          take: size,
          select: selectFields,
        },
      );

      return { ...notification, children: comments, setting };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async createNotification(
    payload: ICommunication,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { author, type, setting, ...rest } = payload;
      let { parent = null } = payload;
      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { id: author },
      });

      if (!member) throw new NotFoundException('Not found member');
      if (parent) {
        parent = await this.getOne(this.dataSourcePostgres, Communicate, {
          where: { id: parent },
        });

        if (!parent) throw new NotFoundException('Not found parent');

        if (parent.type !== type)
          throw new BadRequestException(
            'Type is not suitable to parent record',
          );
      }

      const notificationInstance = this.createInstance(
        this.dataSourcePostgres,
        Communicate,
        {
          ...rest,
          type,
          parent,
          author: member,
        },
      );

      await this.dataSourcePostgres.manager.save(notificationInstance);
      await this.settingService.createNotificationSetting({
        ...setting,
        notification: notificationInstance.id,
      });

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateNotification(
    id: string,
    payload: Partial<ICommunication & { setting: ICommunicateSetting }>,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { setting, ...rest } = payload;
      const notification = await this.getOne(
        this.dataSourcePostgres,
        Communicate,
        { where: { id } },
      );

      if (!notification) throw new NotFoundException('Not found record');

      await Promise.all([
        this.update(this.dataSourcePostgres, Communicate, { id }, rest),
        !isEmpty(setting) &&
          this.settingService.updateNotificationSetting(
            { notification: notification.id },
            setting,
          ),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async softDeleteNotification(
    ids: string[],
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.softDelete(this.dataSourcePostgres, Communicate, {
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
