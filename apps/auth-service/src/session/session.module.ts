import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { CacheModule } from '@lib/core/caching';
import { LoginSession, LoginSessionSchema } from '@lib/core/databases/mongo';
import {
  Attendance,
  Communicate,
  Member,
  MemoNote,
  Role,
} from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { CryptoModule, LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { LoginLogModule } from '../login-log';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [Member, Role, Communicate, MemoNote, Attendance],
  [DbName.Mongo]: [{ name: LoginSession.name, schema: LoginSessionSchema }],
};

@Module({
  imports: [
    LoggerModule,
    CacheModule,
    CryptoModule,
    LoginLogModule,
    ...mapEntities(entities),
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
