import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import {
  BankCheck,
  Deposit,
  Member,
  MemoNote,
  PostMessage,
  RegisterCode,
  Role,
  Withdrawal,
} from '@lib/core/databases/postgres';
import { ServiceProviderModule } from '@lib/core/message-handler';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { PostMessageController } from './post-message.controller';
import { PostMessageService } from './post-message.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [
    PostMessage,
    Member,
    Role,
    MemoNote,
    RegisterCode,
    Deposit,
    BankCheck,
    Withdrawal,
  ],
};

@Module({
  imports: [LoggerModule, ServiceProviderModule, ...mapEntities(entities)],
  controllers: [PostMessageController],
  providers: [PostMessageService],
})
export class PostMessageModule {}
