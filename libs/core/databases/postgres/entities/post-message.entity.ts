import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

@Entity({ name: 'post-message' })
export class PostMessage extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: false, length: 20 })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  confirmDate: Date;

  @ManyToOne(() => Member, (member) => member.messagesSent, {
    onDelete: 'SET NULL',
  })
  sender: Member;

  @ManyToOne(() => Member, (member) => member.messagesReceived, {
    onDelete: 'SET NULL',
  })
  receiver: Member;
}
