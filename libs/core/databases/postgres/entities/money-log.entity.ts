import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

enum MoneyLogStatus {
  Pending = 0,
  Success = 1,
  Fail = 2,
}

enum MoneyLogSource {
  Deposit = 'DEPOSIT',
  Withdraw = 'WITHDRAW',
  Order = 'ORDER',
  Reference = 'REFERENCE',
  Win = 'WIN',
  Loss = 'LOSS',
  Refund = 'REFUND',
  System = 'SYSTEM',
  Other = 'OTHER',
}

@Entity({ name: 'money-log' })
export class MoneyLog extends BaseSchemaEntity {
  @Column({ type: 'varchar' })
  memberId: string;

  @ManyToOne(() => Member, (member) => member.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'memberId' })
  member?: Member;

  @Column({ type: 'bigint', nullable: false })
  money: number;

  @Column({ type: 'bigint', nullable: false })
  moneyTotal: number;

  @Column({ type: 'varchar', default: '[운영자]', length: 255 })
  reason?: string;

  @Column({
    type: 'enum',
    enum: MoneyLogStatus,
    default: MoneyLogStatus.Pending,
  })
  status?: MoneyLogStatus;

  @Column({ type: 'enum', enum: MoneyLogSource, nullable: false })
  source: MoneyLogSource;

  @Column({ type: 'varchar' })
  actionId: string;

  @ManyToOne(() => Member, (member) => member.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'actionId' })
  action?: Member;
}
