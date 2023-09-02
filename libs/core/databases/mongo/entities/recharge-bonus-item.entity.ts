import { BaseSchemaLess } from '../../base-entity';
import { RechargeBonusState } from '@lib/common/interfaces/modules/preference';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'recharge_bonus_item',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class RechargeBonusItem extends BaseSchemaLess {
  @Prop({ type: String, enum: RechargeBonusState })
  type: RechargeBonusState;

  @Prop({ type: Number })
  firstRechargePercent: number;

  @Prop({ type: Number })
  rechargePercent: number;

  @Prop({ type: String })
  rechargeName: string;

  @Prop({ type: Boolean })
  status: boolean;

  @Prop({ type: String })
  rechargeBonusId: string;
}
export const RechargeBonusItemSchema =
  SchemaFactory.createForClass(RechargeBonusItem);
