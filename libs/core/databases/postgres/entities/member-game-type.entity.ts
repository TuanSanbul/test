import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { GameType } from './game-type.entity';
import { Member } from './member.entity';

@Entity({ name: 'member-game-type' })
export class MemberGameType extends BaseSchemaEntity {
  @Column({ type: 'boolean', default: false })
  isAvailability: boolean;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'numeric', default: 0 })
  maxBetAmount: number;

  @Column({ type: 'numeric', default: 0 })
  maxWinningAmount: number;

  @Column({ type: 'numeric', default: 0 })
  dividendRate: number;

  @Column({ type: 'numeric', default: 0 })
  losingPoint: number;

  @Column({ type: 'numeric', default: 0 })
  referralDropPoint: number;

  @Column({ type: 'numeric', default: 0 })
  miniGameBettingTime: number;

  @ManyToOne(() => Member, (member) => member.memberGameTypes, {
    onDelete: 'SET NULL',
  })
  member: Member;

  @ManyToOne(() => GameType, (gameType) => gameType.memberGameTypes, {
    onDelete: 'SET NULL',
  })
  gameType: GameType;
}
