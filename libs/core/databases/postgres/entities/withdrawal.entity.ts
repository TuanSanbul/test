import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

enum WithdrawalState {
  Pending = 'PENDING',
  Approve = 'APPROVE',
  Reject = 'REJECT',
}

enum WithdrawalStatus {
  Show = 0,
  Delete = 1,
}

@Entity({ name: 'withdrawal' })
export class Withdrawal extends BaseSchemaEntity {
  @Column({ type: 'bigint', nullable: false })
  amount: number;

  @Column({ type: 'enum', enum: WithdrawalStatus, nullable: false })
  status: WithdrawalStatus;

  @Column({ type: 'enum', enum: WithdrawalState, nullable: false })
  state: WithdrawalState;

  @Column({ type: 'varchar', nullable: false })
  ipAddress: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  confirmDate: Date;

  @ManyToOne(() => Member, (member) => member.withdrawal, {
    onDelete: 'SET NULL',
  })
  member: Member;
}
