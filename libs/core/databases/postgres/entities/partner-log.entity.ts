import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

@Index(['memberId', 'partnerTypeId', 'lastPayment'], { unique: true })
@Entity({ name: 'partner-log' })
export class PartnerLog extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: false })
  memberId: string;

  @ManyToOne(() => Member, (member) => member.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'memberId' })
  member?: Member;

  @Column({ type: 'varchar', nullable: false })
  partnerTypeId: string;

  @Column({ type: 'bigint', default: 0 })
  totalPayment: number;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  lastPayment: Date | null;
}
