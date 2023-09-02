import { Column, Entity, Index } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';

enum TeamStatus {
  Deactivate = 0,
  Active = 1,
  Hide = 2,
}

@Index(['name', 'leagueId'], { unique: true })
@Entity({ name: 'team' })
export class Team extends BaseSchemaEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nameKo: string;

  @Column({ type: 'uuid' })
  leagueId: string;

  @Column({ type: 'enum', enum: TeamStatus, default: TeamStatus.Active })
  status: TeamStatus;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;
}
