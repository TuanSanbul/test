import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'level_rate',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class LevelRate extends BaseSchemaLess {
  @Prop({ type: Number })
  level: number;

  @Prop({ type: Number })
  rate: number;

  @Prop({ type: Number })
  maxBet: number;

  @Prop({ type: Number })
  maxWinning: number;

  @Prop({ type: String })
  gameConfigId: string;
}
export const LevelRateSchema = SchemaFactory.createForClass(LevelRate);
