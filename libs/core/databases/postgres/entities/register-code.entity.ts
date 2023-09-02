import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Member } from './member.entity';

enum RegisterCodeType {
  Partner = 'PARTNER',
  ReferFriend = 'REFER_A_FRIEND',
}

@Entity({ name: 'register-code' })
export class RegisterCode extends BaseSchemaEntity {
  @Column({ type: 'numeric', nullable: true, default: 0 })
  bonus: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  recommendCode: string;

  @Column({ type: 'enum', enum: RegisterCodeType })
  type: RegisterCodeType;

  @Column({ type: 'varchar', nullable: true })
  detail: string;

  @Column({ type: 'varchar', nullable: true })
  registeredDomain: string;

  @ManyToOne(() => Member, (member) => member.registerCodes, {
    onDelete: 'SET NULL',
  })
  owner: Member;

  @OneToMany(() => Member, (member) => member.recommendedCode, {
    onDelete: 'SET NULL',
  })
  recommendedMembers: Member[];
}
