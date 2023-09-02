import { DbName, DepositState, WithdrawalState } from '@lib/common/enums';
import {
  IMemberMoney,
  IQueryMember,
} from '@lib/common/interfaces/modules/member';
import { BaseRepository } from '@lib/core/base';
import { Deposit, Member, Withdrawal } from '@lib/core/databases/postgres';
import { LoggerService } from '@lib/utils/modules';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import * as moment from 'moment';
import {
  Between,
  DataSource,
  EntityTarget,
  FindOptionsWhere,
  ILike,
  IsNull,
  Not,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class MemberQueryService extends BaseRepository {
  private readonly serviceName: string = MemberQueryService.name;
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

  getLastReceiveDay() {
    return this.dataSourcePostgres.manager
      .createQueryBuilder(Deposit, 'deposit')
      .select('MAX(deposit.createdAt)', 'lastChargeDate')
      .where('deposit.memberId=mb.id')
      .andWhere(`deposit.state = '${DepositState.Approve}'`)
      .getQuery();
  }

  sumMoney<T>(entity: EntityTarget<T>, alias: string) {
    const check = entity === Deposit;
    const field = check ? 'total' : 'amount';
    const state = check ? DepositState : WithdrawalState;

    const query = this.dataSourcePostgres.manager
      .createQueryBuilder(entity, alias)
      .select(`SUM(${alias}.${field})`, `${alias}Money`)
      .where(`${alias}.memberId = mb.id`)
      .andWhere(`${alias}.state = '${state.Approve}'`)
      .andWhere(`${alias}.createdAt BETWEEN :startTimeMoney AND :endTimeMoney`);

    return query.getQuery();
  }

  async getMemberDepositWithdraw(
    memberIds: string[],
    filter: IQueryMember,
  ): Promise<Map<string, IMemberMoney>> {
    try {
      const { queryFields } = filter;
      const {
        startTimeMoney = moment(new Date(0)).utc().toISOString(),
        endTimeMoney = moment().utc().toISOString(),
      } = queryFields;

      const memberMoney: IMemberMoney[] = await this.dataSourcePostgres
        .createQueryBuilder(Member, 'mb')
        .select(['mb.id AS id'])
        .addSelect(`(${this.sumMoney(Deposit, 'deposit')})`, 'depositAmount')
        .addSelect(
          `(${this.sumMoney(Withdrawal, 'withdraw')})`,
          'withdrawAmount',
        )
        .addSelect(
          `((${this.sumMoney(Deposit, 'deposit')}) -
          (${this.sumMoney(Withdrawal, 'withdraw')}))`,
          'revenue',
        )
        .addSelect(
          `((${this.sumMoney(Deposit, 'deposit')}) -
          (${this.sumMoney(Withdrawal, 'withdraw')}))`,
          'revenue',
        )
        .addSelect(`(${this.getLastReceiveDay()})`, 'lastChargeDate')
        .where('mb.id IN (:...memberIds)', { memberIds })
        .setParameters({
          endTimeMoney,
          startTimeMoney,
        })
        .getRawMany();

      const map = new Map(
        memberMoney.map(
          ({ id, depositAmount, withdrawAmount, revenue, lastChargeDate }) => [
            id,
            {
              lastChargeDate,
              revenue: Number(revenue || 0),
              depositAmount: Number(depositAmount || 0),
              withdrawAmount: Number(withdrawAmount || 0),
            },
          ],
        ),
      );

      return map;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateQuery(filter: IQueryMember): SelectQueryBuilder<Member> {
    const {
      queryFields,
      startTime = moment(new Date(0)).utc().toISOString(),
      endTime = moment().utc().toISOString(),
    } = filter;
    const { recommendedCode, recommender, tab, checkDate, ...rest } =
      queryFields;

    const where: FindOptionsWhere<Member> = {};
    for (const key in rest) {
      const operator =
        typeof rest[key] === 'string' ? ILike(`${rest[key]}%`) : rest[key];

      Object.assign(where, { [key]: operator });
    }

    if (checkDate)
      Object.assign(where, { [checkDate]: Between(startTime, endTime) });

    const query = this.dataSourcePostgres.manager
      .createQueryBuilder(Member, 'mb')
      .leftJoinAndSelect('mb.recommender', 'recommender')
      .where(where);

    if (tab === 1)
      query.innerJoinAndSelect('mb.role', 'role', 'role.name = :adminRole', {
        adminRole: this.configService.get<string>('roleInit.admin'),
      });

    if (tab === 2)
      query.andWhere({
        interceptDate: Not(IsNull()),
        leaveDate: Not(IsNull()),
      });

    if (recommendedCode) {
      query.innerJoinAndSelect(
        'mb.registerCodes',
        'registerCodes',
        `registerCodes.recommendCode ILIKE '${recommendedCode}%'`,
      );
    }

    if (recommender)
      query.where({ recommender: { username: ILike(`${recommender}%`) } });

    return query;
  }
}
