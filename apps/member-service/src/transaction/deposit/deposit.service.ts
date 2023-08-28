import { mutationResult } from '@lib/common/constants';
import {
  DbName,
  DepositChargeType,
  DepositState,
  Sort,
} from '@lib/common/enums';
import {
  IMutationResponse,
  IPaginationResponse,
  IQueryMessage,
} from '@lib/common/interfaces';
import { IJwtPayload } from '@lib/common/interfaces/modules/auth';
import {
  IQueryFieldDeposit,
  IRemoveBankCheck,
} from '@lib/common/interfaces/modules/deposit';
import { IMoneyInsert } from '@lib/common/interfaces/modules/money';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { BankCheck, Deposit, Member } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { isEmpty, mapKeys } from 'lodash';
import {
  DataSource,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  In,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MoneyService } from '../../money';

@Injectable()
export class DepositService extends BaseRepository {
  private readonly serviceName: string = DepositService.name;
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
    query: IQueryMessage<IQueryFieldDeposit>,
  ): FindOptionsWhere<Deposit> {
    const { queryFields } = query;
    const { recommenderUsername, ...rest } = queryFields;
    const where: FindOptionsWhere<Deposit> = { member: {} };

    if (recommenderUsername)
      Object.assign(where.member, {
        recommender: { username: recommenderUsername },
      });

    for (const key in rest) {
      const isExistKey = this.checkKeyExistInEntity(
        this.dataSourcePostgres,
        Deposit,
        key,
      );

      const payloadQuery =
        typeof rest[key] == 'number' ? rest[key] : ILike(`${rest[key]}%`);

      Object.assign(isExistKey ? where : where.member, {
        [key]: payloadQuery,
      });
    }
    if (isEmpty(where.member)) delete where.member;

    return where;
  }

  generateOrder(
    query: IQueryMessage<Deposit & Member>,
  ): FindOptionsOrder<Deposit> {
    const { orderFields } = query;

    const orderOptions: FindOptionsOrder<Deposit> = { member: {} };
    for (const key in orderFields) {
      const checkKey = this.checkKeyExistInEntity(
        this.dataSourcePostgres,
        Deposit,
        key,
      );
      Object.assign(checkKey ? orderOptions : orderOptions.member, {
        [key]: orderFields[key],
      });
    }

    if (isEmpty(orderOptions.member)) delete orderOptions.member;

    return orderOptions;
  }

  generateDepositOrder(query: IQueryMessage<Deposit & Member>) {
    const { orderFields } = query;

    const orderOptions = {};
    for (const key in orderFields) {
      const checkKey = this.checkKeyExistInEntity(
        this.dataSourcePostgres,
        Deposit,
        key,
      );

      const sortKey = checkKey ? `deposit.${key}` : `member.${key}`;

      Object.assign(orderOptions, {
        [sortKey]: orderFields[key],
      });
    }

    return orderOptions;
  }

  async getListDeposit(
    payload: IQueryMessage<Deposit & Member>,
  ): Promise<ResponseResult<IPaginationResponse<Deposit>>> {
    try {
      const { page = 1, size = 10 } = payload;

      const where = this.generateCondition(payload);
      const order = this.generateDepositOrder(payload);

      const [results, total] = await this.dataSourcePostgres.manager
        .createQueryBuilder(Deposit, 'deposit')
        .leftJoinAndSelect('deposit.member', 'member')
        .leftJoinAndSelect('member.recommender', 'recommender')
        .loadRelationCountAndMap('member.depositCount', 'member.deposit')
        .loadRelationCountAndMap('member.withdrawalCount', 'member.withdrawal')
        .select([
          'deposit.id',
          'deposit.amount',
          'deposit.total',
          'deposit.status',
          'deposit.state',
          'deposit.ipAddress',
          'deposit.confirmDate',
          'deposit.chargeType',
          'deposit.createdAt',
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
        .getManyAndCount();

      const memberList = results.map((item) => item.member.id);
      memberList.push(uuidv4());

      const countResult = await this.dataSourcePostgres.manager
        .createQueryBuilder(Deposit, 'deposit')
        .select('deposit.memberId', 'memberId')
        .addSelect('COUNT(DISTINCT(deposit.ipAddress))', 'ipCount')
        .where('deposit.memberId IN (:...memberList)', { memberList })
        .groupBy('deposit.memberId')
        .getRawMany();

      type CountMap = Record<string, { memberId: string; ipCount: number }>;
      const countMap: CountMap = mapKeys(countResult, 'memberId');

      const mapResult = results.map((item) => ({
        ...item,
        ipCount: +countMap[item.member.id].ipCount || 0,
      }));
      return { results: mapResult, pagination: { total } };
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async getListIpDeposit(
    payload: IQueryMessage<Deposit & Member>,
  ): Promise<ResponseResult<IPaginationResponse<Deposit>>> {
    try {
      const { page = 1, size = 10, queryFields } = payload;
      const { ipAddress } = queryFields;

      const order = this.generateOrder(payload);

      if (!order) Object.assign(order, { createdAt: Sort.Desc });

      const results = await this.getPagination(
        this.dataSourcePostgres,
        Deposit,
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

  async getBankCheck(
    payload: IQueryMessage<BankCheck>,
  ): Promise<ResponseResult<IPaginationResponse<BankCheck>>> {
    try {
      const { page = 1, size = 10 } = payload;

      const order = this.generateOrder(payload);

      const results = this.getPagination(
        this.dataSourcePostgres,
        BankCheck,
        { page, size },
        {
          order,
          select: {
            id: true,
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
  async removeBankCheck(
    payload: IRemoveBankCheck,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { listId = [] } = payload;
      await this.softDelete(this.dataSourcePostgres, BankCheck, {
        id: In(listId),
      });

      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }

  async approveDeposit(
    id: string,
    request: IJwtPayload,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const deposit = await this.getOne(this.dataSourcePostgres, Deposit, {
        relations: { member: true },
        where: { id },
        select: {
          id: true,
          total: true,
          state: true,
          reChargeTime: true,
          member: {
            id: true,
            username: true,
            depositMoney: true,
          },
        },
      });

      if (!deposit) throw new NotFoundException('Not found deposit ticket');
      if (deposit.state != DepositState.Pending)
        throw new BadRequestException('Ticket not available');

      const { member, reChargeTime, total } = deposit;

      const { depositMoney, id: memberId } = member;

      const payload: IMoneyInsert = {
        amount: Number(deposit.total),
        reason: 'deposit',
        username: member.username,
      };

      const newDepositMoney = depositMoney
        ? Number(depositMoney) + Number(total)
        : total;

      await Promise.all([
        this.moneyService.insertMoney(payload, request),
        this.update(
          this.dataSourcePostgres,
          Deposit,
          { id },
          {
            state: DepositState.Approve,
            confirmDate: new Date(),
            chargeType:
              reChargeTime > 0
                ? DepositChargeType.Recharge
                : DepositChargeType.FirstCharge,
          },
        ),
        this.softDelete(this.dataSourcePostgres, BankCheck, {
          member: { id: member.id },
        }),
        this.update(
          this.dataSourcePostgres,
          Member,
          { id: memberId },
          {
            depositMoney: newDepositMoney,
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

  async rejectDeposit(id: string): Promise<ResponseResult<IMutationResponse>> {
    try {
      const deposit = await this.getOne(this.dataSourcePostgres, Deposit, {
        relations: { member: true },
        where: { id },
        select: {
          member: {
            id: true,
            username: true,
          },
        },
      });
      if (!deposit) throw new NotFoundException('Not found deposit ticket');
      if (deposit.state != DepositState.Pending)
        throw new BadRequestException('Ticket not available');

      const { member } = deposit;

      await Promise.all([
        this.update(
          this.dataSourcePostgres,
          Deposit,
          { id },
          {
            state: DepositState.Reject,
            confirmDate: new Date(),
          },
        ),
        this.softDelete(this.dataSourcePostgres, BankCheck, {
          member: { id: member.id },
        }),
      ]);
      return mutationResult;
    } catch (error) {
      this.logger.error(error.message);
      const errorObj = new GatewayError(error);
      return errorObj.getErrorInstance();
    }
  }
}
