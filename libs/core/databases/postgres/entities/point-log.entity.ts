import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

enum PointStatus {
  Pending = 0,
  Success = 1,
  Fail = 2,
}

enum PointType {
  Positive = 'POSITIVE',
  Negative = 'NEGATIVE',
}

enum PointSource {
  Deposit = 'DEPOSIT',
  Order = 'ORDER',
  Exchange = 'EXCHANGE',
  Reference = 'REFERENCE',
  Event = 'EVENT',
  System = 'SYSTEM',
  Other = 'OTHER',
}

@Entity({ name: 'point-log' })
export class PointLog extends BaseSchemaEntity {
  @Column({ type: 'varchar' })
  memberId: string;

  @ManyToOne(() => Member, (member) => member.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'memberId' })
  member?: Member;

  @Column({ type: 'bigint', nullable: false })
  point: number;

  @Column({ type: 'bigint', nullable: false })
  pointTotal: number;

  @Column({ type: 'varchar', default: '[운영자]', length: 255 })
  reason?: string;

  @Column({ type: 'enum', enum: PointStatus, default: PointStatus.Pending })
  status?: PointStatus;

  @Column({ type: 'enum', enum: PointType })
  type: PointType;

  @Column({ type: 'enum', enum: PointSource, nullable: false })
  source: PointSource;

  @Column({ type: 'varchar' })
  actionId: string;

  @ManyToOne(() => Member, (member) => member.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'actionId' })
  action?: Member;
}
