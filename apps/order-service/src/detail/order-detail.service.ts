import { mutationResult } from '@lib/common/constants';
import { DbName, OrderDetailResult, OrderState } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import { IPayloadCreateOrderDetail } from '@lib/common/interfaces/modules/order/detail';
import { BaseRepository } from '@lib/core/base';
import { Order, OrderDetail } from '@lib/core/databases/postgres';
import { LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { TCPCallService } from '../tcp-call';

@Injectable()
export class OrderDetailService extends BaseRepository {
  private readonly serviceName: string = OrderDetailService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly tcpCall: TCPCallService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async createDetail(
    order: Order,
    payload: IPayloadCreateOrderDetail[],
    queryRunner: QueryRunner,
  ): Promise<IMutationResponse> {
    try {
      const gameDetailIds = payload.map((detail) => detail.gameDetailId);
      const gameDetailMap = await this.tcpCall.getGameDetails(gameDetailIds);

      if (
        !gameDetailMap.size ||
        new Set(gameDetailIds).size !== gameDetailMap.size
      )
        throw new BadRequestException('Invalid game details');

      const orderDetails = payload.map((orderDetail) =>
        this.createInstance(
          this.dataSourcePostgres,
          OrderDetail,
          Object.assign(orderDetail, {
            order,
            gameDetail: gameDetailMap.get(orderDetail.gameDetailId),
            state: OrderState.Pending,
            status: OrderDetailResult.Waiting,
          }),
        ),
      );

      await queryRunner.manager.save(orderDetails);

      return mutationResult;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cancelByOrderId(
    orderId: string,
    state: OrderState,
    queryRunner: QueryRunner,
  ): Promise<IMutationResponse> {
    try {
      await queryRunner.manager.update(
        OrderDetail,
        {
          order: { id: orderId },
        },
        { state },
      );

      return mutationResult;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
