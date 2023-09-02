import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { GameFeed } from './game.entity';

@Index(['createdAt'])
@Index('game_idx', ['gameFeedId'], { unique: true })
@Entity({ name: 'realtime-score' })
export class RealtimeScore extends BaseSchemaEntity {
  @Column({ type: 'uuid' })
  gameFeedId: string;

  @OneToOne(() => GameFeed, (gameFeed) => gameFeed.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gameFeedId' })
  gameFeed?: GameFeed;

  @Column({ type: 'uuid' })
  sportId: string;

  @Column({ type: 'varchar' })
  statusCode: string;

  @Column({ type: 'int' })
  homeTeamScore: number;

  @Column({ type: 'int' })
  awayTeamScore: number;

  @Column({ type: 'varchar', length: 255 })
  note: string;
}
