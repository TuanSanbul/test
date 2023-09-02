import { DbName } from '@lib/common/enums';
import { PartnerType, PartnerTypeSchema } from '@lib/core/databases/mongo';
import { Member, PartnerLog } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';

const entitiesDefine = {
  [DbName.Postgres]: [Member, PartnerLog, PartnerType],
  [DbName.Mongo]: [{ name: PartnerType.name, schema: PartnerTypeSchema }],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entitiesDefine)],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
