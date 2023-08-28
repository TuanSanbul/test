import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import * as mongoSchema from '@lib/core/databases/mongo';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { ConfigWordsController } from './config-words.controller';
import { ConfigWordsService } from './config-words.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Mongo]: [
    { name: mongoSchema.MainConfig.name, schema: mongoSchema.MainConfigSchema },
    {
      name: mongoSchema.MemberConfig.name,
      schema: mongoSchema.MemberConfigSchema,
    },
  ],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [ConfigWordsController],
  providers: [ConfigWordsService],
})
export class ConfigWordsModule {}
