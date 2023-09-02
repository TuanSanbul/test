import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseSchemaEntity } from '../../base-entity';
import { GameCategory } from './game-category.entity';
import { GameDetail } from './game-detail.entity';
import { Order } from './order.entity';

enum OrderState {
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Canceled = 'CANCELED',
  Rejected = 'REJECTED',
  Failed = 'FAILED',
}

enum OrderDetailResult {
  Win = 'WIN',
  Lost = 'LOST',
  Draw = 'DRAW',
  Canceled = 'CANCELED',
  Waiting = 'WAITING',
}

@Entity({ name: 'order-detail' })
export class OrderDetail extends BaseSchemaEntity {
  @Column({
    type: 'enum',
    nullable: false,
    enum: OrderDetailResult,
    default: OrderDetailResult.Waiting,
  })
  result: OrderDetailResult;

  @Column({
    type: 'enum',
    nullable: false,
    enum: OrderState,
    default: OrderState.Pending,
  })
  state: OrderState;

  @Column({ type: 'numeric', default: 0 })
  odds: number;

  @Column({ type: 'numeric', default: 0 })
  handicap: number;

  @ManyToOne(() => GameDetail, (gameDetail) => gameDetail.orderDetails, {
    onDelete: 'SET NULL',
  })
  gameDetail: GameDetail;

  @ManyToOne(() => Order, (order) => order.details, {
    onDelete: 'SET NULL',
  })
  order: Order;

  @ManyToOne(() => GameCategory, (gameCategory) => gameCategory.orderDetails, {
    onDelete: 'SET NULL',
  })
  gameCategory: GameCategory;
}
