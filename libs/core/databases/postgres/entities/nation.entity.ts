import { Column, Entity, Index } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';

enum NationStatus {
  Deactivate = 0,
  Active = 1,
  Hide = 2,
}

@Index(['name', 'order'])
@Entity({ name: 'nation' })
export class Nation extends BaseSchemaEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nameKo: string;

  @Column({ type: 'enum', enum: NationStatus, default: NationStatus.Active })
  status: NationStatus;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;
}
