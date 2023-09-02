import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../../base-entity';

@Schema({
  collection: 'recharge_bonus',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class RechargeBonus extends BaseSchemaLess {
  @Prop({ type: Number })
  level: number;

  @Prop({ type: Boolean })
  status: boolean;

  @Prop({ type: String })
  mainConfigId: string;
}
export const RechargeBonusSchema = SchemaFactory.createForClass(RechargeBonus);
