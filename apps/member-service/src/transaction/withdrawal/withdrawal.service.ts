import { mutationResult } from '@lib/common/constants';
import {
  DbName,
  DepositState,
  MoneyLogSource,
  Sort,
  WithdrawalState,
  WithdrawalStatus,
} from '@lib/common/enums';
import {
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import { IQueryFieldWithdraw } from '@lib/common/interfaces/modules/deposit';
import { IMoneyInsert } from '@lib/common/interfaces/modules/money';
import {
  ICreateWithdrawal,
  IRejectWithdrawal,
} from '@lib/common/interfaces/modules/withdrawal';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Deposit, Member, Withdrawal } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty, mapKeys } from 'lodash';
import * as moment from 'moment';
import {
  Between,
  DataSource,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
} from 'typeorm';
import { MoneyService } from '../../money';

@Injectable()
export class WithdrawalService extends BaseRepository {
  private readonly serviceName: string = WithdrawalService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    logger: LoggerService,
    private readonly moneyService: MoneyService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  generateCondition(
    query: IQueryMessage<IQueryFieldWithdraw>,
    startTime: Date | string,
    endTime: Date | string,
  ): FindOptionsWhere<Withdrawal> {
    const { queryFields } = query;
    const { recommenderUsername, ...rest } = queryFields;
    const where: FindOptionsWhere<Withdrawal> = { member: {} };

    if (recommenderUsername)
      Object.assign(where.member, {
        recommender: { username: recommenderUsername },
      });

    for (const key in rest) {
      const isExistKey = this.checkKeyExistInEntity(
        this.dataSourcePostgres,
        Withdrawal,
        key,
      );

      const payloadQuery =
        typeof rest[key] == 'number' ? rest[key] : ILike(`${rest[key]}%`);

      Object.assign(isExistKey ? where : where.member, {
        [key]: payloadQuery,
      });
    }
    if (isEmpty(where.member)) delete where.member;

    Object.assign(where, { createdAt: Between(startTime, endTime) });
    return where;
  }

  generateOrder(
    query: IQueryMessage<Withdrawal & Member>,
  ): FindOptionsOrder<Withdrawal> {
    const { orderFields } = query;

    const orderOptions: FindOptionsOrder<Withdrawal> = { member: {} };
    for (const key in orderFields) {
      const checkKey = this.checkKeyExistInEntity(
        this.dataSourcePostgres,
        Withdrawal,
        key,
      );

      Object.assign(checkKey ? orderOptions : orderOptions.member, {
        [key]: orderFields[key],
      });
    }

    if (isEmpty(orderOptions.member)) delete orderOptions.member;

    return orderOptions;
  }

  generateWithdrawalOrder(query: IQueryMessage<Withdrawal & Member>) {
    const { orderFields } = query;

    const orderOptions = {};
    for (const key in orderFields) {
      const checkKey = this.checkKeyExistInEntity(
        this.dataSourcePostgres,
        Withdrawal,
        key,
      );

      const sortKey = checkKey ? `withdrawal.${key}` : `member.${key}`;

      Object.assign(orderOptions, {
        [sortKey]: orderFields[key],
      });
    }

    return orderOptions;
  }

  getRechargeAfterExchange() {
    return this.dataSourcePostgres.manager
      .createQueryBuilder(Deposit, 'deposit')
      .select('SUM(deposit.amount)', 'depositMoney')
      .where(`deposit.state = '${DepositState.Approve}'`)
      .andWhere('deposit.createdAt > withdrawal.createdAt')
      .andWhere('deposit.memberId = withdrawal.memberId')
      .getQuery();
  }

  getLastChargeAmount() {
    return this.dataSourcePostgres.manager
      .createQueryBuilder(Deposit, 'deposit')
      .select('deposit.amount', 'lastCharge')
      .where(`deposit.state = '${DepositState.Approve}'`)
      .andWhere('deposit.createdAt < withdrawal.createdAt')
      .andWhere('deposit.memberId = withdrawal.memberId')
      .limit(1)
      .getQuery();
  }

  async getListWithdrawal(
    payload: IQueryMessage<Withdrawal & Member>,
  ): Promise<ResponseResult<IPaginationResponse<Withdrawal>>> {
    try {
      const {
        page = 1,
        size = 10,
        startTime = moment(new Date(0)).utc().startOf('date').toISOString(),
        endTime = moment().utc().endOf('date').toISOString(),
      } = payload;

      const where = this.generateCondition(payload, startTime, endTime);
      const order = this.generateWithdrawalOrder(payload);

      const baseQuery = this.dataSourcePostgres.manager
        .createQueryBuilder(Withdrawal, 'withdrawal')
        .leftJoinAndSelect('withdrawal.member', 'member')
        .leftJoinAndSelect('member.recommender', 'recommender')
        .where(where)
        .orderBy(order)
        .take(size)
        .offset((page - 1) * size);

      const [[results, total], rawResult] = await Promise.all([
        baseQuery
          .loadRelationCountAndMap('member.depositCount', 'member.deposit')
          .loadRelationCountAndMap(
            'member.withdrawalCount',
            'member.withdrawal',
          )
          .select([
            'withdrawal.id',
            'withdrawal.amount',
            'withdrawal.status',
            'withdrawal.state',
            'withdrawal.ipAddress',
            'withdrawal.confirmDate',
            'withdrawal.createdAt',
            'member.id',
            'member.username',
            'member.nickName',
            'member.level',
            'member.group',
            'member.fullName',
            'member.bankAccountNumber',
            'member.bankOwnerName',
            'member.bankName',
            'recommender.id',
            'recommender.nickName',
            'recommender.username',
          ])
          .where(where)
          .orderBy(order)
          .take(size)
          .offset((page - 1) * size)
          .getManyAndCount(),
        baseQuery
          .clone()
          .select(['withdrawal.id AS id'])
          .addSelect(
            `(${this.getRechargeAfterExchange()})`,
            'rechargeAfterExchange',
          )
          .addSelect(`(${this.getLastChargeAmount()})`, 'lastChargeAmount')
          .getRawMany(),
      ]);

      const memberList = results.map((item) => item.member.id);

      if (isEmpty(memberList)) return { results, pagination: { total: 0 } };

      const countResult = await this.dataSourcePostgres.manager
        .createQueryBuilder(Withdrawal, 'withdrawal')
        .select('withdrawal.memberId', 'memberId')
        .addSelect('COUNT(DISTINCT(withdrawal.ipAddress))', 'ipCount')
        .where('withdrawal.memberId IN (:...memberList)', { memberList })
        .groupBy('withdrawal.memberId')
        .getRawMany();

      type CountMap = Record<string, { memberId: string; ipCount: number }>;
      const countMap: CountMap = mapKeys(countResult, 'memberId');

      type RawMap = Record<
        string,
        { id: string; rechargeAfterExchange: number; lastChargeAmount: number }
      >;
      const rawMap: RawMap = mapKeys(rawResult, 'id');

      const mapResult = results.map((item) => ({
        ...item,
        rechargeAfterExchange: rawMap[item.id]?.rechargeAfterExchange || 0,
        lastChargeAmount: rawMap[item.id]?.lastChargeAmount || 0,
        ipCount: +countMap[item.member.id]?.ipCount || 0,
      }));
      return { results: mapResult, pagination: { total } };
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async createWithdrawal(
    data: ICreateWithdrawal,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { amount, ipAddress, memberId, request } = data;

      const [{ exist }, member] = await Promise.all([
        this.dataSourcePostgres.manager
          .createQueryBuilder(Withdrawal, 'withdrawal')
          .select([
            `COUNT(CASE WHEN withdrawal.state = 'PENDING'then 1 end) AS exist`,
          ])
          .where(' withdrawal.memberId = :memberId', { memberId })
          .getRawOne(),
        this.getOne(this.dataSourcePostgres, Member, {
          where: { id: memberId },
        }),
      ]);

      if (!member) throw new NotFoundException('Not found member');
      if (exist > 0) throw new BadRequestException('Existing a pending ticket');

      const { money } = member;

      if (money < amount)
        throw new BadRequestException('Not enough money to withdraw');

      const payload: IMoneyInsert = {
        amount: Number(-amount),
        reason: 'withdrawal',
        username: member.username,
        source: MoneyLogSource.Withdraw,
      };

      await Promise.all([
        this.moneyService.insertMoney(payload, request),
        this.create(this.dataSourcePostgres, Withdrawal, {
          amount,
          ipAddress,
          state: WithdrawalState.Pending,
          status: WithdrawalStatus.Show,
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

  async approveWithdrawal(
    id: string,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const withdrawal = await this.getOne(
        this.dataSourcePostgres,
        Withdrawal,
        {
          relations: { member: true },
          where: { id },
        },
      );

      if (!withdrawal) throw new NotFoundException('Not found deposit ticket');
      if (withdrawal.state != WithdrawalState.Pending)
        throw new BadRequestException('Ticket not available');

      const { member, amount } = withdrawal;
      const { withdrawMoney, id: memberId } = member;

      const newWithdrawMoney = withdrawMoney
        ? Number(withdrawMoney) + Number(amount)
        : amount;
      await Promise.all([
        this.update(
          this.dataSourcePostgres,
          Withdrawal,
          { id },
          {
            state: WithdrawalState.Approve,
            confirmDate: new Date(),
          },
        ),
        this.update(
          this.dataSourcePostgres,
          Member,
          { id: memberId },
          {
            withdrawMoney: newWithdrawMoney,
          },
        ),
      ]);

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async rejectWithdrawal(
    data: IRejectWithdrawal,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { id, request } = data;

      const withdrawal = await this.getOne(
        this.dataSourcePostgres,
        Withdrawal,
        {
          relations: { member: true },
          where: { id },
          select: {
            id: true,
            amount: true,
            state: true,
            member: {
              id: true,
              username: true,
            },
          },
        },
      );
      if (!withdrawal) throw new NotFoundException('Not found deposit ticket');
      if (withdrawal.state != WithdrawalState.Pending)
        throw new BadRequestException('Ticket not available');

      const { member, amount } = withdrawal;

      if (!member) throw new NotFoundException('Not found member');

      const payload: IMoneyInsert = {
        amount: Number(amount),
        reason: 'Reject Withdrawal',
        username: member.username,
        source: MoneyLogSource.Refund,
      };

      await Promise.all([
        this.moneyService.insertMoney(payload, request),
        this.update(
          this.dataSourcePostgres,
          Withdrawal,
          { id },
          {
            state: WithdrawalState.Reject,
            confirmDate: new Date(),
          },
        ),
      ]);
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getListIpWithdrawal(
    payload: IQueryMessage<Withdrawal & Member>,
  ): Promise<ResponseResult<IPaginationResponse<Withdrawal>>> {
    try {
      const { page = 1, size = 10, queryFields } = payload;
      const { ipAddress } = queryFields;

      const order = this.generateOrder(payload);

      if (!order) Object.assign(order, { createdAt: Sort.Desc });

      const results = await this.getPagination(
        this.dataSourcePostgres,
        Withdrawal,
        {
          page,
          size,
        },
        {
          where: { ipAddress: ILike(`${ipAddress}%`) },
          order,
          select: {
            id: true,
            ipAddress: true,
            confirmDate: true,
            createdAt: true,
            member: {
              id: true,
              nickName: true,
              username: true,
              level: true,
              group: true,
            },
          },
          relations: { member: true },
        },
      );

      return results;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }
}

/*  
create:  insert -money, insert log, insert withdrawal
approve: update state
reject: insert +money, update state
list
user delete
history


*/
