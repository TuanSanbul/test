import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

@Entity({ name: 'member-game-config' })
export class MemberGameConfig extends BaseSchemaEntity {
  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'numeric', default: 0 })
  firstChargePoint: number;

  @Column({ type: 'numeric', default: 0 })
  percentPerCharge: number;

  @Column({ type: 'numeric', default: 0 })
  winOdds: number;

  @Column({ type: 'numeric', default: 0 })
  lossOdds: number;

  @Column({ type: 'numeric', default: 0 })
  handicap: number;

  @Column({ type: 'numeric', default: 0 })
  dividendFor4Folders: number;

  @Column({ type: 'numeric', default: 0 })
  minimumDividendFor4Folders: number;

  @Column({ type: 'numeric', default: 0 })
  liveBetting: number;

  @Column({ type: 'numeric', default: 0 })
  payback: number;

  @OneToOne(() => Member, (member) => member.gameConfig, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  member: Member;
}
