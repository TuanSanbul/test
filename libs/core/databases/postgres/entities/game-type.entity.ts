import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { GameCategory } from './game-category.entity';
import { MemberGameType } from './member-game-type.entity';

@Entity({ name: 'game-type' })
export class GameType extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  nameKo: string;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  order: number;

  @Column({ type: 'boolean', nullable: true })
  isActive: boolean;

  @Column({ type: 'boolean', nullable: true })
  isAutoResult: boolean;

  @Column({ type: 'boolean', nullable: true })
  isAutoRegistration: boolean;

  @Column({ type: 'uuid' })
  gameCategoryId: string;

  @ManyToOne(() => GameCategory, (gameCategory) => gameCategory.gameType, {
    onDelete: 'SET NULL',
  })
  gameCategory: GameCategory;

  @OneToMany(() => MemberGameType, (memberGameType) => memberGameType.member, {
    onDelete: 'SET NULL',
  })
  memberGameTypes: MemberGameType[];
}
