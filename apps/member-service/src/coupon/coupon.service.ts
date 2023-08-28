import { CouponItemsInit, mutationResult } from '@lib/common/constants';
import {
  CoinLogSource,
  CoinLogStatus,
  CouponFilterBy,
  CouponStatus,
  DbName,
  Sort,
} from '@lib/common/enums';
import { IPaginationResponse } from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import {
  CouponLogQuery,
  ICouponConfig,
  ICouponExchange,
  ICouponUsed,
} from '@lib/common/interfaces/modules/coupon';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { CouponItems, MainConfig } from '@lib/core/databases/mongo';
import { CouponLog, Member } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { Connection } from 'mongoose';
import {
  Between,
  DataSource,
  FindManyOptions,
  ILike,
  IsNull,
  Not,
} from 'typeorm';
import { CoinService } from '../coin';

@Injectable()
export class CouponService extends BaseRepository implements OnModuleInit {
  private readonly serviceName: string = CouponService.name;
  private readonly logger: LoggerService;
  private readonly REASON_PAY: '구매';

  constructor(
    @InjectConnection(DbName.Mongo)
    private readonly dataSourceMongo: Connection,
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    logger: LoggerService,
    private readonly coinService: CoinService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async onModuleInit() {
    const findInit = await this.getMany(this.dataSourceMongo, CouponItems);
    if (isEmpty(findInit)) {
      const couponItems: CouponItems[] = CouponItemsInit.map((ele) => ({
        ...ele,
        isActive: true,
        term: 30,
      }));
      await this.create(this.dataSourceMongo, CouponItems, couponItems);
      this.logger.debug('[Initial]:', couponItems.length);
    }
  }

  async getListItems(): Promise<CouponItems[]> {
    return this.getMany(
      this.dataSourceMongo,
      CouponItems,
      { isActive: true },
      {
        projection: {
          id: true,
          name: true,
          description: true,
          price: true,
          rate: true,
          term: true,
          unit: true,
          itemIndex: true,
        },
        order: { itemIndex: -1 },
      },
    );
  }

  async getListLogs(
    payload: CouponLogQuery,
  ): Promise<ResponseResult<IPaginationResponse<CouponLog>>> {
    try {
      const {
        page = 1,
        size = 10,
        startTime = new Date(0),
        endTime = new Date(),
        queryFields,
        orderFields,
        filterBy = CouponFilterBy.CreatedAt,
      } = payload;

      const orderBy = { ['couponLog.createdAt']: Sort.Desc };
      const where: FindManyOptions<CouponLog> = {};

      const baseQuery = this.dataSourcePostgres.manager
        .createQueryBuilder(CouponLog, 'couponLog')
        .where({ [filterBy]: Between(startTime, endTime) });

      if (!isEmpty(queryFields)) {
        for (const key in queryFields) {
          const existKeyMember = this.checkKeyExistInEntity(
            this.dataSourcePostgres,
            Member,
            key,
          );
          if (existKeyMember) {
            where['member'] = { [key]: ILike(`${queryFields[key]}%`) };
          } else {
            where[key] = ILike(`${queryFields[key]}%`);
          }
        }
      }

      if (!isEmpty(orderFields)) {
        for (const key in orderFields) {
          const existKeyMember = this.checkKeyExistInEntity(
            this.dataSourcePostgres,
            Member,
            key,
          );
          if (existKeyMember) {
            orderBy['member'] = { [key]: orderFields[key] };
          } else {
            orderBy[key] = orderFields[key];
          }
        }
      }

      const [[results = [], total = 0], listCouponItems] = await Promise.all([
        baseQuery
          .clone()
          .andWhere(where)
          .leftJoinAndSelect('couponLog.member', 'member')
          .select([
            'couponLog',
            'member.nickName',
            'member.username',
            'member.fullName',
            'member.level',
            'member.group',
          ])
          .offset((page - 1) * size)
          .limit(size)
          .orderBy(orderBy)
          .getManyAndCount(),
        this.getListItems(),
      ]);

      let couponItemsMap = new Map();
      if (!isEmpty(listCouponItems))
        couponItemsMap = new Map(
          listCouponItems.map((item) => [item.id, item]),
        );

      const mappingCouponLog = results.map((coupon) => ({
        ...coupon,
        couponItem: couponItemsMap.get(coupon.couponId),
      }));

      return {
        results: mappingCouponLog,
        pagination: { total },
      };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async updateConfig(payload: ICouponConfig) {
    try {
      return this.update(this.dataSourceMongo, MainConfig, null, {
        isUseCouponItem: payload.toggle,
      });
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async used(payload: ICouponUsed, status = CouponStatus.AdminCheck) {
    try {
      const coupon = await this.getOne(this.dataSourcePostgres, CouponLog, {
        where: { id: payload.id, usingTime: IsNull() },
      });
      if (!coupon) throw new NotFoundException();

      const entity: Partial<CouponLog> = { usingTime: new Date(), status };
      return this.update(
        this.dataSourcePostgres,
        CouponLog,
        { id: payload.id },
        entity,
      );
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async exchange(payload: ICouponExchange, request: IJwtPayload) {
    try {
      const isUseCoupon = await this.exist(this.dataSourceMongo, MainConfig, {
        isUseCouponItem: true,
      });
      if (!isUseCoupon)
        throw new NotImplementedException('Coupon Use Currently Disabled!');

      const { couponId } = payload;

      const [member, coupon] = await Promise.all([
        this.getOne(this.dataSourcePostgres, Member, {
          where: { id: request.memberId },
        }),
        this.getOne(this.dataSourceMongo, CouponItems, {
          id: couponId,
        }),
      ]);
      if (isEmpty(member) || isEmpty(coupon)) throw new NotFoundException();

      const couponExist = await this.exist(this.dataSourcePostgres, CouponLog, {
        couponId,
        memberId: request.memberId,
        status: CouponStatus.Available,
        usingTime: Not(IsNull()),
      });
      if (couponExist) throw new ConflictException('Already have this coupon!');

      const subTotalCoin = member.coin - coupon.price;

      if (subTotalCoin < 0)
        throw new BadRequestException('Balance not enough!');

      const reason = `[${this.REASON_PAY}]: ${coupon.name}`;

      const expireTime = moment().add(coupon.term, 'days').toDate();
      await Promise.all([
        this.coinService.insertCoin(request, {
          amount: -coupon.price,
          username: member.username,
          reason,
          source: CoinLogSource.Buy,
          status: CoinLogStatus.Success,
        }),
        this.insertLog(request, couponId, expireTime),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async insertLog(
    request: IJwtPayload,
    couponId: string,
    expireTime: Date,
    status = CouponStatus.Available,
  ) {
    const couponLog: CouponLog = {
      couponId,
      memberId: request.memberId,
      status,
      expireTime,
    };
    const entityCouponLog = this.createInstance(
      this.dataSourcePostgres,
      CouponLog,
      couponLog,
    );
    return this.create(this.dataSourcePostgres, CouponLog, entityCouponLog);
  }
}
