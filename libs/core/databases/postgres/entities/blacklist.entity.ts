import { BaseSchemaEntity } from '../../base-entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Member } from './member.entity';

enum BlackListType {
  Ip = 'IP',
  Member = 'MEMBER',
}

@Entity({ name: 'black-list' })
export class BlackList extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: true })
  detail: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  ipAddress: string;

  @Column({ type: 'enum', enum: BlackListType })
  type: BlackListType;

  @OneToOne(() => Member, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'memberId' })
  member: Member;
}
