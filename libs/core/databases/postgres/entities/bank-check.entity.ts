import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

@Entity({ name: 'bank-check' })
export class BankCheck extends BaseSchemaEntity {
  @ManyToOne(() => Member, (member) => member.deposit, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'memberId' })
  member: Member;
}
