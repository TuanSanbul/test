import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { Attendance } from './attendance.entity';
import { BankCheck } from './bank-check.entity';
import { Communicate } from './communicate.entity';
import { Deposit } from './deposit.entity';
import { MemberGameConfig } from './member-game-config.entity';
import { MemberGameType } from './member-game-type.entity';
import { MemoNote } from './memo-note.entity';
import { Order } from './order.entity';
import { PostMessage } from './post-message.entity';
import { RegisterCode } from './register-code.entity';
import { Role } from './role.entity';
import { Withdrawal } from './withdrawal.entity';

enum GenderEnum {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

@Entity({ name: 'member' })
export class Member extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: false, length: 20, unique: true })
  nickName: string;

  @Column({ type: 'varchar', nullable: false, length: 30 })
  fullName: string;

  @Column({ type: 'timestamp', nullable: true })
  doB: Date;

  @Column({ type: 'enum', enum: GenderEnum, default: GenderEnum.Male })
  gender: GenderEnum;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 20 })
  phone: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  level: number;

  @Column({ type: 'varchar', nullable: false, default: 'A', length: 1 })
  group: string;

  @Column({ type: 'bigint', default: 0 })
  point: number;

  @Column({ type: 'bigint', default: 0 })
  coin: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  verifiedEMail: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  verifiedPhone: boolean;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: false, length: 20, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: false, length: 60, select: false })
  password: string;

  @Column({ type: 'varchar', nullable: false, length: 60, select: false })
  exchangePassword: string;

  @Column({ type: 'bigint', default: 0 })
  money: number;

  @Column({ type: 'bigint', default: 0 })
  depositMoney: number;

  @Column({ type: 'bigint', default: 0 })
  withdrawMoney: number;

  @Column({ type: 'varchar', nullable: true })
  bankName: string;

  @Column({ type: 'varchar', nullable: true })
  bankOwnerName: string;

  @Column({ type: 'varchar', nullable: true })
  bankAccountNumber: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  verified: boolean;

  @Column({ type: 'boolean', nullable: false, default: false })
  isInterested: boolean;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  leaveDate: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  interceptDate: Date;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  lastAccess: Date;

  @Column({ type: 'varchar', nullable: true, default: null })
  lastLoginIP: string;

  @ManyToOne(() => Role, (role) => role.members, {
    onDelete: 'SET NULL',
  })
  role: Role;

  @OneToMany(() => Communicate, (communicate) => communicate.author, {
    onDelete: 'SET NULL',
  })
  communicates: Communicate[];

  @OneToMany(() => PostMessage, (postMessage) => postMessage.sender, {
    onDelete: 'SET NULL',
  })
  messagesSent: PostMessage[];

  @OneToMany(() => PostMessage, (postMessage) => postMessage.receiver, {
    onDelete: 'SET NULL',
  })
  messagesReceived: PostMessage[];

  @ManyToOne(() => Member, (member) => member.recommended, {
    onDelete: 'SET NULL',
  })
  recommender: Member;

  @OneToMany(() => Member, (member) => member.recommender, {
    onDelete: 'SET NULL',
  })
  recommended: Member[];

  @OneToMany(() => RegisterCode, (registerCode) => registerCode.owner, {
    onDelete: 'SET NULL',
  })
  registerCodes: RegisterCode[];

  @OneToMany(() => Deposit, (deposit) => deposit.member, {
    onDelete: 'SET NULL',
  })
  deposit: Deposit[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.member, {
    onDelete: 'SET NULL',
  })
  withdrawal: Withdrawal[];

  @ManyToOne(
    () => RegisterCode,
    (registerCode) => registerCode.recommendedMembers,
    {
      onDelete: 'SET NULL',
    },
  )
  recommendedCode: RegisterCode;

  @OneToMany(() => MemoNote, (memoNote) => memoNote.member, {
    onDelete: 'SET NULL',
  })
  notes: MemoNote[];

  @OneToMany(() => BankCheck, (bankCheck) => bankCheck.member, {
    onDelete: 'SET NULL',
  })
  bankCheck: BankCheck[];

  @OneToMany(() => Attendance, (attendance) => attendance.member, {
    onDelete: 'SET NULL',
  })
  attendances: Attendance[];

  @OneToMany(() => Order, (order) => order.member, {
    onDelete: 'SET NULL',
  })
  orders: Order[];

  @OneToMany(() => MemberGameType, (memberGameType) => memberGameType.member, {
    onDelete: 'SET NULL',
  })
  memberGameTypes: MemberGameType[];

  @OneToOne(() => MemberGameConfig, (gameConfig) => gameConfig.member, {
    onDelete: 'SET NULL',
  })
  gameConfig: MemberGameConfig;

  @BeforeInsert()
  @BeforeUpdate()
  formatGroup() {
    this.group = this.group ? this.group.toLocaleUpperCase() : 'A';
  }
}
