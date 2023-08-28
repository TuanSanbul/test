import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

enum DepositState {
  Pending = 'PENDING',
  Approve = 'APPROVE',
  Reject = 'REJECT',
}

enum DepositStatus {
  Show = 0,
  Delete = 1,
}

enum DepositType {
  Salary = 'SALARY',
  UserDeposit = 'USER_DEPOSIT',
  AdminDeposit = 'ADMIN_DEPOSIT',
}

enum DepositChargeType {
  FirstCharge = 'FIRST_CHARGE',
  Recharge = 'RECHARGE',
}

@Entity({ name: 'deposit' })
export class Deposit extends BaseSchemaEntity {
  @Column({ type: 'bigint', nullable: false })
  amount: number;

  @Column({ type: 'bigint', nullable: false })
  total: number;

  @Column({ type: 'varchar', nullable: true, default: 0 })
  rechargeId: string;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  firstChargeBonus: number;

  @Column({ type: 'bigint', nullable: true, default: 0 })
  reChargeBonus: number;

  @Column({ type: 'bigint', nullable: false })
  reChargeTime: number;

  @Column({ type: 'boolean', nullable: false })
  isBonusApply: boolean;

  @Column({ type: 'enum', enum: DepositStatus, nullable: false })
  status: DepositStatus;

  @Column({ type: 'enum', enum: DepositState, nullable: false })
  state: DepositState;

  @Column({ type: 'enum', enum: DepositType, nullable: false })
  type: DepositType;

  @Column({ type: 'enum', enum: DepositChargeType, nullable: true })
  chargeType: DepositChargeType;

  @Column({ type: 'varchar', nullable: false })
  ipAddress: string;

  @Column({
    type: 'timestamptz',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  confirmDate: Date;

  @ManyToOne(() => Member, (member) => member.deposit, {
    onDelete: 'SET NULL',
  })
  member: Member;
}
