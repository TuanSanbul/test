import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';
import { OrderDetail } from './order-detail.entity';

enum OrderState {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Canceled = 'CANCELED',
  Rejected = 'REJECTED',
  Failed = 'FAILED',
}
enum OrderCurrency {
  KRW = 'KRW',
  USD = 'USD',
  VND = 'VND',
}

@Entity({ name: 'order' })
export class Order extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: false, length: 20, unique: true })
  code: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  ipAddress: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: OrderState,
    default: OrderState.Pending,
  })
  state: OrderState;

  @Column({ type: 'bigint', default: 0 })
  betAmount: number;

  @Column({ type: 'bigint', default: 0 })
  expectWinning: number;

  @Column({ type: 'bigint', default: 0 })
  winningMoney?: number;

  @Column({ type: 'numeric', default: 0 })
  rate: number;

  @Column({ type: 'numeric', default: 0 })
  winningOdd?: number;

  @Column({ type: 'enum', nullable: false, enum: OrderCurrency })
  currency: OrderCurrency;

  @ManyToOne(() => Member, (member) => member.orders, {
    onDelete: 'SET NULL',
  })
  member: Member;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order, {
    onDelete: 'SET NULL',
  })
  details?: OrderDetail[];
}
