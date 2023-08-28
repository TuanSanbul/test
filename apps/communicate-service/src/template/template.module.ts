import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import {
  CommunicateTemplate,
  CommunicateTemplateSchema,
} from '@lib/core/databases/mongo';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Mongo]: [
    { name: CommunicateTemplate.name, schema: CommunicateTemplateSchema },
  ],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
