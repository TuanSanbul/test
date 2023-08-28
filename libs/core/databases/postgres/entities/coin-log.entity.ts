import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

enum CoinLogSource {
  System = 'SYSTEM',
  Exchange = 'EXCHANGE',
  Buy = 'BUY',
}

enum CoinLogStatus {
  Pending = 0,
  Success = 1,
  Fail = 2,
}

@Entity({ name: 'coin-log' })
export class CoinLog extends BaseSchemaEntity {
  @Column({ type: 'varchar' })
  memberId: string;

  @ManyToOne(() => Member, (member) => member.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'memberId' })
  member?: Member;

  @Column({ type: 'bigint', nullable: true })
  coin: number;

  @Column({ type: 'bigint', nullable: true })
  coinTotal: number;

  @Column({ type: 'varchar', length: 255 })
  reason: string;

  @Column({ type: 'enum', enum: CoinLogStatus, default: CoinLogStatus.Pending })
  status?: CoinLogStatus;

  @Column({ type: 'enum', enum: CoinLogSource, nullable: false })
  source: CoinLogSource;

  @Column({ type: 'varchar' })
  actionId: string;

  @ManyToOne(() => Member, (member) => member.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'actionId' })
  action?: Member;
}
