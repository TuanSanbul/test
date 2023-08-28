import { Column, Entity, Index } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';

enum SportStatus {
  Deactivate = 0,
  Active = 1,
  Hide = 2,
}

@Index(['name', 'order'])
@Entity({ name: 'sport' })
export class Sport extends BaseSchemaEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nameKo: string;

  @Column({ type: 'enum', enum: SportStatus, default: SportStatus.Active })
  status: SportStatus;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;
}
