import { Column, Entity, OneToMany } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { GameType } from './game-type.entity';
import { OrderDetail } from './order-detail.entity';

@Entity({ name: 'game-category' })
export class GameCategory extends BaseSchemaEntity {
  @Column({ type: 'varchar', nullable: true, unique: true })
  name: string;

  @OneToMany(() => GameType, (gameType) => gameType.gameCategory, {
    onDelete: 'SET NULL',
  })
  gameType: GameType[];

  @OneToMany(() => OrderDetail, (detail) => detail.gameCategory, {
    onDelete: 'SET NULL',
  })
  orderDetails: OrderDetail[];
}
