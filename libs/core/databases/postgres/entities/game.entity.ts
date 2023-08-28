import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { GameCategory } from './game-category.entity';
import { GameDetail } from './game-detail.entity';
import { League } from './league.entity';
import { Nation } from './nation.entity';
import { RealtimeScore } from './realscore.entity';
import { Sport } from './sport.entity';

enum GameFeedType {
  PreMatch = 'PRE_MATCH',
  InPlay = 'IN_PLAY',
}

enum GameEventStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Abandoned = 'ABANDONED',
  Suspended = 'SUSPENDED',
  Resulted = 'RESULTED',
}

enum GameMatchStatus {
  NotYet = 'NOT_YET',
  Inprogress = 'INPROGRESS',
  Interrupted = 'INTERRUPTED',
  Finish = 'FINISHED',
  NotAvailable = 'NOT_AVAILABLE',
  Abandoned = 'ABANDONED',
  Postponed = 'POSTPONED',
  Resulted = 'RESULTED',
  Canceled = 'CANCELED',
}

@Index('gameFeedIdx', ['id', 'fid'], { unique: true })
@Index('homeTeamIdx', ['homeTeam'])
@Index('awayTeamIdx', ['awayTeam'])
@Index('leagueIdx', ['leagueId'])
@Index('nationIdx', ['nationId'])
@Index('sportIdx', ['sportId'])
@Index('startTimeIdx', ['startTime'])
@Index(['createdAt', 'updatedAt'])
@Entity({ name: 'game-feed' })
export class GameFeed extends BaseSchemaEntity {
  @OneToMany(() => GameDetail, (gameDetail) => gameDetail.gameFeed, {
    onDelete: 'SET NULL',
  })
  details?: GameDetail[];

  @OneToOne(() => RealtimeScore, (realScore) => realScore.gameFeed, {
    onDelete: 'SET NULL',
  })
  realScore?: RealtimeScore;

  @Column({ type: 'varchar', unique: true })
  fid: string;

  @Column({ type: 'uuid' })
  sportId: string;

  @Column({ type: 'varchar', length: 100 })
  sportName: string;

  @ManyToOne(() => Sport, (sport) => sport.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sportId' })
  sport?: Sport;

  @Column({ type: 'uuid' })
  leagueId: string;

  @Column({ type: 'varchar', length: 100 })
  leagueName: string;

  @ManyToOne(() => League, (league) => league.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'leagueId' })
  league?: League;

  @Column({ type: 'uuid' })
  nationId: string;

  @Column({ type: 'varchar', length: 100 })
  nationName: string;

  @ManyToOne(() => Nation, (nation) => nation.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'nationId' })
  nation?: Nation;

  @Column({ type: 'varchar', length: 100 })
  homeTeam: string;

  @Column({ type: 'uuid' })
  homeTeamId: string;

  @Column({ type: 'varchar', length: 100 })
  awayTeam: string;

  @Column({ type: 'uuid' })
  awayTeamId: string;

  @Column({ type: 'enum', enum: GameFeedType })
  type: GameFeedType;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  @Column({ type: 'enum', enum: GameMatchStatus })
  matchStatus: GameMatchStatus;

  @Column({ type: 'enum', enum: GameEventStatus })
  eventStatus: GameEventStatus;

  @ManyToMany(() => GameCategory)
  @JoinTable({ name: 'game-feed-category' })
  gameCategories: GameCategory[];
}
