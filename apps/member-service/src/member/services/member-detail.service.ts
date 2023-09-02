import { DbName, DepositState, WithdrawalState } from '@lib/common/enums';
import { BaseRepository } from '@lib/core/base';
import { Deposit, Withdrawal } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import * as moment from 'moment';
import { DataSource } from 'typeorm';

@Injectable()
export class MemberDetailService extends BaseRepository {
  private readonly serviceName: string = MemberDetailService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly configService: ConfigService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getHistory(memberId: string) {
    try {
      const subQueryWithdraw = this.dataSourcePostgres.manager
        .createQueryBuilder(Withdrawal, 'withdraw')
        .select('1', 'type')
        .addSelect('SUM(withdraw.amount)', 'price')
        .addSelect(`TO_CHAR(withdraw.createdAt,'YYYY-MM')`, 'createdMonth')
        .where('withdraw.memberId = :memberId')
        .andWhere(`withdraw.state = '${WithdrawalState.Approve}'`)
        .groupBy('"createdMonth"')
        .orderBy('"createdMonth"')
        .getQuery();

      const subQueryDeposit = this.dataSourcePostgres.manager
        .createQueryBuilder(Deposit, 'deposit')
        .select('2', 'type')
        .addSelect('SUM(deposit.total)', 'price')
        .addSelect(`TO_CHAR(deposit.createdAt,'YYYY-MM')`, 'createdMonth')
        .where('deposit.memberId = :memberId')
        .andWhere(`deposit.state = '${DepositState.Approve}'`)
        .groupBy('"createdMonth"')
        .orderBy('"createdMonth"')
        .getQuery();

      const history = await this.dataSourcePostgres.manager
        .createQueryBuilder()
        .from(`((${subQueryDeposit}) UNION ALL (${subQueryWithdraw}))`, 'main')
        .setParameters({ memberId })
        .getRawMany();

      const map = new Map();
      history.map((current) => {
        const rangeTime = `${moment(current.regDate)
          .startOf('month')
          .format('YYYY-MM-DD')} ~ ${moment(current.regDate)
          .endOf('month')
          .format('YYYY-MM-DD')}`;

        const rangeTimeData = map.get(rangeTime);

        const field = current.type === 1 ? 'withdraw' : 'deposit';
        const assignObj = rangeTimeData
          ? Object.assign(rangeTimeData, { [field]: Number(current.price) })
          : { [field]: Number(current.price) };

        map.set(rangeTime, assignObj);
      });

      const results = [];
      map.forEach((value, key) => {
        const { deposit = 0, withdraw = 0 } = value;
        const diff = deposit - withdraw;
        results.push({ period: key, deposit, withdraw, diff });
      });

      return results;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
