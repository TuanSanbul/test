import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

@Entity({ name: 'attendance' })
export class Attendance extends BaseSchemaEntity {
  @Column({ type: 'date', nullable: false })
  date: string;

  @ManyToOne(() => Member, (member) => member.attendances, {
    onDelete: 'SET NULL',
  })
  member: Member;
}
