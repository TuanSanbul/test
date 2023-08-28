import { DbName } from '@lib/common/enums';
import { IEntitiesMapMetadata } from '@lib/common/types';
import { Member, MemoNote } from '@lib/core/databases/postgres';
import { mapEntities } from '@lib/utils/helpers';
import { LoggerModule } from '@lib/utils/modules';
import { Module } from '@nestjs/common';
import { NoteController } from './node.controller';
import { NoteService } from './note.service';

const entities: IEntitiesMapMetadata = {
  [DbName.Postgres]: [MemoNote, Member],
};

@Module({
  imports: [LoggerModule, ...mapEntities(entities)],
  controllers: [NoteController],
  providers: [NoteService],
  exports: [NoteService],
})
export class NoteModule {}
