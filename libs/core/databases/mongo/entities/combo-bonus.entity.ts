import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'combo_bonus',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class ComboBonus extends BaseSchemaLess {
  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  odds: number;

  @Prop({ type: String })
  mainConfigId: string;
}
export const ComboBonusSchema = SchemaFactory.createForClass(ComboBonus);
