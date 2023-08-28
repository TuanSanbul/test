import {
  CommunicateEnum,
  DbName,
  DepositState,
  MemoNoteType,
  Sort,
} from '@lib/common/enums';
import { IPaginationResponse } from '@lib/common/interfaces';
import { IQueryMember } from '@lib/common/interfaces/modules/member';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull, Not, SelectQueryBuilder } from 'typeorm';
import { MemberQueryService } from './member-query.service';

@Injectable()
export class MemberListingService extends BaseRepository {
  private readonly serviceName: string = MemberListingService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    private readonly memberQueryService: MemberQueryService,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  joinQuery(query: SelectQueryBuilder<Member>): SelectQueryBuilder<Member> {
    query
      .leftJoinAndSelect('mb.recommendedCode', 'recommendedCode')
      .loadRelationCountAndMap(
        'mb.depositCount',
        'mb.deposit',
        'deposit',
        (qb) =>
          qb.where('deposit.state = :state', { state: DepositState.Approve }),
      )
      .loadRelationCountAndMap(
        'mb.boardCount',
        'mb.communicates',
        'board',
        (qb) => qb.where('board.type = :type', { type: CommunicateEnum.Board }),
      )
      .loadRelationCountAndMap(
        'mb.customerCount',
        'mb.communicates',
        'customer',
        (qb) =>
          qb.where('customer.type = :type', { type: CommunicateEnum.Customer }),
      )
      .loadRelationCountAndMap(
        'recommender.recommendedCount',
        'recommender.recommended',
        'refRecommended',
      )
      .loadRelationCountAndMap('mb.refCount', 'mb.recommended', 'ref')
      .select([
        'mb',
        'recommender.id',
        'recommender.username',
        'recommender.nickName',
        'recommendedCode.id',
        'recommendedCode.recommendCode',
      ]);

    return query.orderBy({ 'mb.createdAt': Sort.Desc });
  }

  async getList(filter: IQueryMember): Promise<
    ResponseResult<
      IPaginationResponse<Member> & {
        blacklistCount: number;
        blockCount: number;
      }
    >
  > {
    try {
      const { page = 1, size = 20 } = filter;
      const query = this.memberQueryService.generateQuery(filter);
      const [blacklistCount, blockCount, [results, total]] = await Promise.all([
        query
          .clone()
          .andWhere({ interceptDate: Not(IsNull()) })
          .getCount(),
        query
          .clone()
          .andWhere({ leaveDate: Not(IsNull()) })
          .getCount(),
        this.joinQuery(query)
          .offset((page - 1) * size)
          .limit(size)
          .getManyAndCount(),
      ]);

      const memberMoneyData =
        results.length > 0
          ? await this.memberQueryService.getMemberDepositWithdraw(
              results.map((member) => member.id),
              filter,
            )
          : null;

      return {
        blacklistCount,
        blockCount,
        results: results.map((member) =>
          Object.assign(member, memberMoneyData.get(member.id)),
        ),
        pagination: { total },
      };
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getMemberConfig(id: string): Promise<ResponseResult<Member>> {
    try {
      const member = await this.dataSourcePostgres.manager
        .createQueryBuilder(Member, 'mb')
        .leftJoinAndSelect('mb.notes', 'note', 'note.type = :noteType', {
          noteType: MemoNoteType.Note,
        })
        .leftJoinAndSelect('mb.recommender', 'recommender')
        .where({ id })
        .select([
          'mb.id',
          'mb.phone',
          'mb.leaveDate',
          'mb.interceptDate',
          'mb.bankName',
          'mb.bankAccountNumber',
          'mb.bankOwnerName',
          'mb.lastLoginIP',
          'note',
          'recommender.id',
          'recommender.username',
        ])
        .getOne();

      if (!member) throw new NotFoundException('Not found member');

      return member;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async getDetailConfig(id: string): Promise<ResponseResult<Member>> {
    try {
      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { id },
        select: {
          recommender: {
            id: true,
            username: true,
          },
          notes: true,
          recommendedCode: true,
        },
        relations: {
          notes: true,
          recommender: true,
          recommendedCode: true,
          role: true,
        },
      });

      if (!member) throw new NotFoundException('Not found member');

      return member;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
