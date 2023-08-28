import { mutationResult, mutationResultFail } from '@lib/common/constants';
import { DbName, MoneyLogSource, OrderState } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import { IMoneyInsert } from '@lib/common/interfaces/modules/money';
import { IPayloadCreateOrder } from '@lib/common/interfaces/modules/order';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member, Order } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as randomatic from 'randomatic';
import { DataSource } from 'typeorm';
import { OrderDetailService } from '../detail';
import { TCPCallService } from '../tcp-call';

@Injectable()
export class OrderService extends BaseRepository {
  private readonly serviceName: string = OrderService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    @Inject(forwardRef(() => OrderDetailService))
    private readonly orderDetailService: OrderDetailService,
    @Inject(forwardRef(() => TCPCallService))
    private readonly tcpCall: TCPCallService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async createBetRecord(
    memberId: string,
    payload: IPayloadCreateOrder,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      if (!memberId) throw new NotFoundException('Invalid member');

      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { id: memberId },
      });

      if (!member) throw new NotFoundException('Not found member');

      const { betAmount } = payload;
      const orderCode = randomatic('Aa0', 20);
      const order = await this.createOrder(member, orderCode, payload);

      if (!order)
        throw new HttpException(
          'Can not create dependencies',
          HttpStatus.BAD_REQUEST,
        );

      const payloadModifyMoney: IMoneyInsert = {
        memberId,
        amount: -betAmount,
        reason: `[주문]: ${orderCode}`,
        source: MoneyLogSource.Order,
      };

      await this.tcpCall.modifyMemberMoney(
        order.id,
        payloadModifyMoney,
        memberId,
      );

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async createOrder(
    member: Member,
    orderCode: string,
    payload: IPayloadCreateOrder,
  ): Promise<Order> {
    const queryRunner = this.dataSourcePostgres.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { orderDetails, ...rest } = payload;
      const orderInstance = this.createInstance(
        this.dataSourcePostgres,
        Order,
        Object.assign(rest, {
          member,
          code: orderCode,
          state: OrderState.Pending,
        }),
      );

      await queryRunner.manager.save(orderInstance);

      await this.orderDetailService.createDetail(
        orderInstance,
        orderDetails,
        queryRunner,
      );

      return orderInstance;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
      return null;
    }
  }

  async modifyStateOrder(
    id: string,
    state: OrderState,
  ): Promise<ResponseResult<IMutationResponse>> {
    const queryRunner = this.dataSourcePostgres.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await Promise.all([
        this.orderDetailService.cancelByOrderId(id, state, queryRunner),
        queryRunner.manager.update(Order, { id }, { state }),
      ]);

      return mutationResult;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);

      return errorObject.getErrorInstance();
    } finally {
      await queryRunner.release();

      return mutationResultFail;
    }
  }
}
