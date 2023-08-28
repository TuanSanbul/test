import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { GameFeed } from './game.entity';
import { Market } from './market.entity';
import { OrderDetail } from './order-detail.entity';
import { Team } from './team.entity';

enum GameDetailStatus {
  Pending = 'PENDING',
  Open = 'OPEN',
  Close = 'CLOSE',
  Other = 'OTHER',
}

@Entity({ name: 'game-detail' })
@Index('name_idx', ['name'])
@Index('market_idx', ['marketId'])
@Index('homeTeam_idx', ['homeTeamId'])
@Index('awayTeam_idx', ['awayTeamId'])
@Index(['createdAt', 'updatedAt'])
@Index(['marketId', 'gameFeedId', 'name'], { unique: true })
export class GameDetail extends BaseSchemaEntity {
  @Column({ type: 'uuid' })
  gameFeedId: string;

  @ManyToOne(() => GameFeed, (gameFeed) => gameFeed.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'gameFeedId' })
  gameFeed?: GameFeed;

  @Column({ type: 'uuid' })
  marketId: string;

  @ManyToOne(() => Market, (market) => market.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'marketId' })
  market?: Market;

  @Column({ type: 'uuid' })
  homeTeamId: string;

  @ManyToOne(() => Team, (team) => team.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'homeTeamId' })
  homeTeam?: Team;

  @Column({ type: 'uuid' })
  awayTeamId: string;

  @ManyToOne(() => Team, (team) => team.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'awayTeamId' })
  awayTeam?: Team;

  @Column({
    type: 'enum',
    enum: GameDetailStatus,
    default: GameDetailStatus.Open,
  })
  status: GameDetailStatus;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'float' })
  odds: number;

  @Column({ type: 'float' })
  bodds: number;

  @Column({ type: 'float' })
  codds: number;

  @Column({ type: 'varchar', nullable: true })
  handicap: number;

  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.gameDetail, {
    onDelete: 'SET NULL',
  })
  orderDetails: OrderDetail[];
}
