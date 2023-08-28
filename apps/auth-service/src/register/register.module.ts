import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import {
  Communicate,
  Member,
  PostMessage,
  RegisterCode,
  Role,
} from '@lib/core/databases/postgres';
import { ServiceProviderModule } from '@lib/core/message-handler';
import { mapEntities } from '@lib/utils/helpers';
import { CryptoModule, LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [Member, Role, Communicate, PostMessage, RegisterCode],
};

@Module({
  imports: [
    ServiceProviderModule,
    LoggerModule,
    CryptoModule,
    ...mapEntities(entities),
  ],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}
