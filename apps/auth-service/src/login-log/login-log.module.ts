import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { LoginLog, LoginLogSchema } from '@lib/core/databases/mongo';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { LoginLogService } from './login-log.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Mongo]: [{ name: LoginLog.name, schema: LoginLogSchema }],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  providers: [LoginLogService],
  exports: [LoginLogService],
})
export class LoginLogModule {}
