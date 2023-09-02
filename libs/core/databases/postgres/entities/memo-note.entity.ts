import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

enum MemoNoteType {
  Note = 'NOTE',
  Money = 'MONEY',
}

@Entity({ name: 'memo-note' })
export class MemoNote extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: true })
  content: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: MemoNoteType,
    default: MemoNoteType.Note,
  })
  type: MemoNoteType;

  @Column({ type: 'timestamp', nullable: true })
  noteDate: Date;

  @ManyToOne(() => Member, (member) => member.notes, {
    onDelete: 'SET NULL',
  })
  member: Member;
}
