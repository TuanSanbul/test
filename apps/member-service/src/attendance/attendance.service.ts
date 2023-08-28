import { mutationResult, relatedMemberInfo } from '@lib/common/constants';
import { AttendanceTabEnum, DbName, Sort } from '@lib/common/enums';
import { IMutationResponse, IPaginationResponse } from '@lib/common/interfaces';
import {
  IPayloadCreateAttendance,
  IQueryAttendance,
} from '@lib/common/interfaces/modules/member';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Attendance, Member } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Between, DataSource, FindOptionsWhere } from 'typeorm';

@Injectable()
export class AttendanceService extends BaseRepository {
  private readonly serviceName: string = AttendanceService.name;
  private readonly logger: LoggerService;
  constructor(
    @InjectDataSource(DbName.Postgres)
    private readonly dataSourcePostgres: DataSource,
    logger: LoggerService,
  ) {
    super();
    this.logger = logger;
    this.logger.setContext(this.serviceName);
  }

  async getListMonthly(
    filter: IQueryAttendance,
  ): Promise<IPaginationResponse<Member>> {
    try {
      const {
        page = 1,
        size = 20,
        startTime = new Date(),
        queryFields,
      } = filter;
      const { username, nickName } = queryFields;

      const monthString = moment(startTime).format('YYYY-MM');
      const daysOfMonth = moment(startTime, 'YYYY-MM').daysInMonth();

      const where: FindOptionsWhere<Member> = {};
      if (username || nickName) {
        ['username', 'nickName'].map(
          (key) =>
            queryFields[key] &&
            Object.assign(where, { [key]: queryFields[key] }),
        );
      }

      const subQuery = this.dataSourcePostgres.manager
        .createQueryBuilder(Attendance, 'attendance')
        .select('COUNT(*)', 'attendanceCount')
        .addSelect(['attendance.memberId AS memberId'])
        .where(`to_char(attendance.date, 'YYYY-MM') = '${monthString}'`)
        .groupBy('attendance.memberId')
        .getQuery();

      const query = this.dataSourcePostgres.manager
        .createQueryBuilder(Member, 'member')
        .leftJoinAndSelect(`(${subQuery})`, 'sub', 'member.id = sub.memberId')
        .select([
          'member.id AS id',
          'member.username AS username',
          'member.nickName AS nickName',
          'member.group',
          '"attendanceCount"',
        ])
        .where(where)
        .andWhere('"attendanceCount" = :daysOfMonth', { daysOfMonth });

      const [results, total] = await Promise.all([
        query
          .clone()
          .offset((page - 1) * size)
          .limit(size)
          .getRawMany(),
        query.clone().getCount(),
      ]);

      return { results, pagination: { total } };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getListDaily(
    filter: IQueryAttendance,
  ): Promise<IPaginationResponse<Member>> {
    try {
      const {
        page = 1,
        size = 20,
        startTime = new Date(0),
        endTime = new Date(),
        queryFields,
      } = filter;
      const { username, nickName } = queryFields;

      const formattedStartTime = moment(startTime).format('YYYY-MM-DD');
      const formattedEndTime = moment(endTime).format('YYYY-MM-DD');
      const diffTime = moment.duration(moment(endTime).diff(moment(startTime)));
      const diffDays = Math.round(diffTime.asDays()) + 1;

      const where: FindOptionsWhere<Member> = {};
      if (username || nickName) {
        ['username', 'nickName'].map(
          (key) =>
            queryFields[key] &&
            Object.assign(where, { [key]: queryFields[key] }),
        );
      }

      const subQuery = this.dataSourcePostgres.manager
        .createQueryBuilder(Attendance, 'attendance')
        .select('COUNT(*)', 'attendanceCount')
        .addSelect(['attendance.memberId AS memberId'])
        .where(
          `attendance.date BETWEEN '${formattedStartTime}' AND '${formattedEndTime}'`,
        )
        .groupBy('attendance.memberId')
        .getQuery();

      const query = this.dataSourcePostgres.manager
        .createQueryBuilder(Member, 'member')
        .leftJoinAndSelect(`(${subQuery})`, 'sub', 'member.id = sub.memberId')
        .select([
          'member.id AS id',
          'member.username AS username',
          'member.nickName AS nickName',
          '"attendanceCount"',
        ])
        .where(where)
        .andWhere('"attendanceCount" = :diffDays', { diffDays });

      const [results, total] = await Promise.all([
        query
          .clone()
          .offset((page - 1) * size)
          .limit(size)
          .getRawMany(),
        query.clone().getCount(),
      ]);

      return { results, pagination: { total } };
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getListToday(
    query: IQueryAttendance,
  ): Promise<IPaginationResponse<Attendance>> {
    try {
      const {
        page = 1,
        size = 20,
        startTime = new Date(0),
        endTime = new Date(),
        queryFields,
      } = query;
      const { username, nickName } = queryFields;

      const where: FindOptionsWhere<Attendance> = {};
      if (username) Object.assign(where, { member: { username } });
      if (nickName) Object.assign(where, { member: { nickName } });

      const results = await this.getPagination(
        this.dataSourcePostgres,
        Attendance,
        { page, size },
        {
          where: {
            ...where,
            createdAt: Between(startTime, endTime),
          },
          order: { createdAt: Sort.Desc },
          relations: { member: true },
          select: { member: relatedMemberInfo },
        },
      );

      return results;
    } catch (error) {
      throw new HttpException(
        error?.message || null,
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getList(
    query: IQueryAttendance,
  ): Promise<ResponseResult<IPaginationResponse<Member | Attendance>>> {
    try {
      const { tab } = query.queryFields;

      const funcExecute = {
        [AttendanceTabEnum.Today]: () => this.getListToday(query),
        [AttendanceTabEnum.Daily]: () => this.getListDaily(query),
        [AttendanceTabEnum.Monthly]: () => this.getListMonthly(query),
      }[tab];

      const results = await funcExecute();

      return results;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async createAttendance(
    payload: IPayloadCreateAttendance,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { username } = payload;
      const date = moment(new Date()).format('YYYY-MM-DD');
      const [member, checkExistedAttendance] = await Promise.all([
        this.getOne(this.dataSourcePostgres, Member, {
          where: { username },
        }),
        this.exist(this.dataSourcePostgres, Attendance, {
          date,
          member: { username },
        }),
      ]);

      if (!member) throw new NotFoundException('Not found member ');
      if (checkExistedAttendance) return mutationResult;

      const newAttendance: Attendance = {
        member,
        date: moment().utc().format('YYYY-MM-DD'),
      };

      await this.create(this.dataSourcePostgres, Attendance, newAttendance);

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async deleteAttendance(
    id: string,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.softDelete(this.dataSourcePostgres, Attendance, { id });

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
