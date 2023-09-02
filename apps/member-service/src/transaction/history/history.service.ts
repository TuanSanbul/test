import { DbName, DepositState, WithdrawalState } from '@lib/common/enums';
import {
  IGetHistory,
  ISumMoney,
} from '@lib/common/interfaces/modules/transaction';
import { BaseRepository } from '@lib/core/base';
import { Deposit, Member, Withdrawal } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityTarget } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class HistoryService extends BaseRepository {
  private readonly serviceName: string = HistoryService.name;
  private readonly logger: LoggerService;
  private readonly transactionField = {
    id: true,
    amount: true,
    createdAt: true,
    confirmDate: true,
    state: true,
    status: true,
  };
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  subQuery(
    entity: EntityTarget<Deposit | Withdrawal>,
    alias: string,
    type: 1 | 2,
  ) {
    return this.dataSourcePostgres.manager
      .createQueryBuilder(entity, alias)
      .where(
        `${alias}.memberId = :memberId AND ${alias}.createdAt BETWEEN :startTime AND :endTime`,
      )
      .select(`${type}`, 'type')
      .addSelect([
        `${alias}.id AS id`,
        `${alias}.amount AS amount`,
        `${alias}.createdAt AS createdAt`,
        `${alias}.confirmDate AS confirmDate`,
        `${alias}.state::VARCHAR`,
        `${alias}.status::VARCHAR`,
      ])
      .getQuery();
  }

  async getHistory(payload: IGetHistory) {
    try {
      const {
        page = 1,
        size = 10,
        startTime = moment(new Date(0)).utc().startOf('date').toISOString(),
        endTime = moment().utc().endOf('date').toISOString(),
        memberId,
      } = payload;

      const formatStartTime = moment(startTime)
        .utc()
        .startOf('date')
        .toISOString();
      const formatEndTime = moment(endTime).utc().endOf('date').toISOString();

      const filter: ISumMoney = {
        memberId,
        startTime: formatStartTime,
        endTime: formatEndTime,
      };

      const query = this.dataSourcePostgres.manager
        .createQueryBuilder()
        .from(
          `((${this.subQuery(Deposit, 'deposit', 1)})
            UNION ALL 
          (${this.subQuery(Withdrawal, 'withdraw', 2)}))`,
          't',
        )
        .setParameters({
          memberId,
          startTime: formatStartTime,
          endTime: formatEndTime,
        })
        .limit(size)
        .offset((page - 1) * size);

      const [filterResult, member, transaction, { total = 0 }] =
        await Promise.all([
          this.sumMoney(filter),
          this.dataSourcePostgres.manager
            .createQueryBuilder(Member, 'member')
            .loadRelationCountAndMap('member.depositCount', 'member.deposit')
            .loadRelationCountAndMap(
              'member.withdrawalCount',
              'member.withdrawal',
            )
            .select([
              'member.id',
              'member.nickName',
              'member.username',
              'member.fullName',
              'member.depositMoney',
              'member.withdrawMoney',
            ])
            .where({ id: memberId })
            .getOne(),
          query.getRawMany(),
          query.clone().select('COUNT(*)', 'total').getRawOne(),
        ]);

      if (!member) throw new NotFoundException('Not found member');

      return {
        member,
        filterResult,
        transaction: { results: transaction, pagination: { total } },
      };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async sumMoney(payload: ISumMoney) {
    try {
      const { memberId, startTime, endTime } = payload;

      const [deposit, withdrawal] = await Promise.all([
        this.dataSourcePostgres.manager
          .createQueryBuilder(Deposit, 'deposit')
          .select('SUM(deposit.total)', 'filterDepositMoney')
          .addSelect('COUNT(deposit.memberId)', 'filterDepositCount')
          .where('deposit.state = :state', { state: DepositState.Approve })
          .andWhere(
            `deposit.createdAt >= :startTime AND deposit.createdAt <= :endTime`,
          )
          .andWhere('deposit.memberId = :memberId')
          .setParameters({ memberId, startTime, endTime })
          .getRawOne(),
        this.dataSourcePostgres.manager
          .createQueryBuilder(Withdrawal, 'withdrawal')
          .select('SUM(withdrawal.amount)', 'filterWithdrawalMoney')
          .addSelect('COUNT(withdrawal.memberId)', 'filterWithdrawalCount')
          .where('withdrawal.state = :state', {
            state: WithdrawalState.Approve,
          })
          .andWhere('withdrawal.memberId = :memberId')
          .andWhere(
            `withdrawal.createdAt >= :startTime AND withdrawal.createdAt <= :endTime`,
          )
          .setParameters({ memberId, startTime, endTime })
          .getRawOne(),
      ]);

      return { deposit, withdrawal };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
