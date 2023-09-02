import { mutationResult } from '@lib/common/constants';
import { DbName } from '@lib/common/enums';
import { IMutationResponse } from '@lib/common/interfaces';
import { IMemoNote } from '@lib/common/interfaces/modules/member';
import { ResponseResult } from '@lib/common/types';
import { BaseRepository } from '@lib/core/base';
import { Member, MemoNote } from '@lib/core/databases/postgres';
import { GatewayError } from '@lib/utils/middlewares';
import { LoggerService } from '@lib/utils/modules';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as moment from 'moment';
import { DataSource, In } from 'typeorm';

@Injectable()
export class NoteService extends BaseRepository {
  private readonly serviceName: string = NoteService.name;
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

  async createNote(
    payload: IMemoNote,
  ): Promise<ResponseResult<IMutationResponse>> {
    try {
      const { noteDate = moment().utc().toDate(), member: memberId } = payload;
      const member = await this.getOne(this.dataSourcePostgres, Member, {
        where: { id: memberId },
      });

      if (!member) throw new NotFoundException('Not found member');

      await this.create(this.dataSourcePostgres, MemoNote, {
        ...payload,
        noteDate,
        member,
      });

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }

  async deleteNote(ids: string[]): Promise<ResponseResult<IMutationResponse>> {
    try {
      await this.softDelete(this.dataSourcePostgres, MemoNote, { id: In(ids) });

      return mutationResult;
    } catch (error) {
      this.logger.error(error?.message);
      const errorObject = new GatewayError(error);
      return errorObject.getErrorInstance();
    }
  }
}
