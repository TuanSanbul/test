import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { RegisterCode } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { RegisterCodeController } from './register-code.controller';
import { RegisterCodeService } from './register-code.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [RegisterCode],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [RegisterCodeController],
  providers: [RegisterCodeService],
  exports: [RegisterCodeService],
})
export class RegisterCodeModule {}
