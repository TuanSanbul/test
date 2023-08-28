import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { CacheModule } from '@lib/core/caching';
import { LoginSession, LoginSessionSchema } from '@lib/core/databases/mongo';
import {
  Communicate,
  Member,
  MemoNote,
  Role,
} from '@lib/core/databases/postgres';
import { ServiceProviderModule } from '@lib/core/message-handler';
import { mapEntities } from '@lib/utils/helpers';
import { CryptoModule, LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { RoleModule } from '../role';
import { MemberController } from './member.controller';
import {
  MemberDetailService,
  MemberIPService,
  MemberListingService,
  MemberMutationService,
  MemberQueryService,
} from './services';
import { GameConfigModule } from '../game-config';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [Member, Role, Communicate, MemoNote],
  [DbName.Mongo]: [{ name: LoginSession.name, schema: LoginSessionSchema }],
};

const services = [
  MemberListingService,
  MemberMutationService,
  MemberIPService,
  MemberQueryService,
  MemberDetailService,
];

@Module({
  imports: [
    LoggerModule,
    CryptoModule,
    RoleModule,
    GameConfigModule,
    CacheModule,
    ServiceProviderModule,
    ...mapEntities(entities),
  ],
  controllers: [MemberController],
  providers: services,
  exports: services,
})
export class MemberModule {}
