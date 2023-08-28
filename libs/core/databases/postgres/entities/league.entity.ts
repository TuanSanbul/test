import { Column, Entity, Index, Unique } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';

enum LeagueStatus {
  Deactivate = 0,
  Active = 1,
  Hide = 2,
}

@Unique('leagueUnique', ['name', 'season'])
@Index(['name', 'order'])
@Entity({ name: 'league' })
export class League extends BaseSchemaEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nameKo: string;

  @Column({ type: 'int' })
  order: number;

  @Column({ type: 'enum', enum: LeagueStatus, default: LeagueStatus.Active })
  status: LeagueStatus;

  @Column({ type: 'varchar', length: 50 })
  season: string;

  @Column({ type: 'uuid' })
  sportId: string;

  @Column({ type: 'uuid' })
  nationId: string;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;
}
