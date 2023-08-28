import { Column, Entity, OneToMany } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

@Entity({ name: 'role' })
export class Role extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: false, length: 20, unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @OneToMany(() => Member, (member) => member.role, {
    onDelete: 'SET NULL',
  })
  members: Member[];
}
