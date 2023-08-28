import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

enum CouponStatus {
  Available = 0,
  Used = 1,
  AdminCheck = 2,
}

@Entity({ name: 'coupon-log' })
export class CouponLog extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: false })
  memberId: string;

  @ManyToOne(() => Member, (member) => member.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'memberId' })
  member?: Member;

  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.Available })
  status: CouponStatus;

  @Column({ type: 'varchar' })
  couponId: string;

  @Column({ type: 'timestamp', nullable: true })
  usingTime?: Date;

  @Column({ type: 'timestamp' })
  expireTime?: Date;
}
