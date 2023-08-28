import { mutationResult } from '@lib/common/constants';
import {
  DbName,
  DepositState,
  DepositStatus,
  DepositType,
} from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import { ICreateDeposit } from '@lib/common/interfaces/modules/deposit';
import { RechargeBonusState } from '@lib/common/interfaces/modules/preference';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { RechargeBonus } from '@lib/core/databases/mongo';
import { BankCheck, Deposit, Member } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { Connection, PipelineStage } from 'mongoose';
import { DataSource } from 'typeorm';

@Injectable()
export class DepositService extends BaseRepository {
  private readonly serviceName: string = DepositService.name;
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

  async createDeposit(
    payload: ICreateDeposit,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { memberId, rechargeId, amount, ipAddress, rechargeItemId } =
        payload;

      const [{ quantity, exist }, member] = await Promise.all([
        this.dataSourcePostgres.manager
          .createQueryBuilder(Deposit, 'deposit')
          .select([
            `COUNT(CASE WHEN deposit.state = 'APPROVE'then 1 end) AS quantity`,
            `COUNT(CASE WHEN deposit.state = 'PENDING'then 1 end) AS exist`,
          ])
          .where(' deposit.memberId = :memberId', { memberId })
          .getRawOne(),
        this.getOne(this.dataSourcePostgres, Member, {
          where: { id: memberId },
        }),
      ]);

      if (!member) throw new NotFoundException('Not found member');
      if (exist > 0) throw new BadRequestException('Existing a pending ticket');

      const { level } = member;

      const { total, firstChargeBonus, reChargeBonus, status } =
        await this.calculateBonus(
          rechargeId,
          rechargeItemId,
          Number(quantity),
          amount,
          level,
        );

      await Promise.all([
        this.create(this.dataSourcePostgres, Deposit, {
          firstChargeBonus,
          reChargeBonus,
          total,
          rechargeId,
          reChargeTime: Number(quantity),
          amount,
          member,
          ipAddress,
          isBonusApply: status,
          state: DepositState.Pending,
          status: DepositStatus.Show,
          type: DepositType.UserDeposit,
        }),
        this.create(this.dataSourcePostgres, BankCheck, {
          member,
        }),
      ]);
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async calculateBonus(
    rechargeId: string,
    rechargeItemId: string,
    numCharge: number,
    amount: number,
    level: number,
  ) {
    try {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            id: rechargeId,
            level,
          },
        },
        {
          $lookup: {
            from: 'recharge_bonus_item',
            localField: 'id',
            foreignField: 'rechargeBonusId',
            as: 'listItem',
            pipeline: [
              { $match: { id: rechargeItemId } },
              { $sort: { level: 1 } },
              {
                $project: {
                  id: 1,
                  firstRechargePercent: 1,
                  rechargePercent: 1,
                  rechargeName: 1,
                  status: 1,
                  type: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            id: 1,
            status: 1,
            level: 1,
            listItem: 1,
          },
        },
      ];
      const rechargeModel = this.getSchemaLessModel(
        this.dataSourceMongo,
        RechargeBonus,
      );
      const results = await rechargeModel.aggregate(pipeline);

      let total = 0;
      let firstChargeBonus = 0;
      let reChargeBonus = 0;

      if (isEmpty(results) || isEmpty(results[0].listItem))
        throw new NotFoundException('Not found charge bonus');

      const recharge = results[0];

      const { status } = recharge;
      const {
        status: itemStatus,
        type,
        firstRechargePercent,
        rechargePercent,
      } = recharge.listItem[0];

      if (status && itemStatus) {
        const bonus = {
          [RechargeBonusState.FirstCharge]: {
            firstChargeBonus: firstRechargePercent,
            reChargeBonus: 0,
          },
          [RechargeBonusState.Recharge]: {
            firstChargeBonus: 0,
            reChargeBonus: rechargePercent,
          },
          [RechargeBonusState.Unpaid]: {
            firstChargeBonus: 0,
            reChargeBonus: 0,
          },
        }[type];
        firstChargeBonus = !numCharge ? bonus.firstChargeBonus : 0;
        reChargeBonus = numCharge ? bonus.reChargeBonus : 0;
      }

      total =
        Number(amount) + (amount * (firstChargeBonus + reChargeBonus)) / 100;

      return { total, firstChargeBonus, reChargeBonus, status };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
