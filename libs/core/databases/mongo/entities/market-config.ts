import { MarketConfigStatus } from '@lib/common/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../../base-entity';

@Schema({
  collection: 'market_config',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class MarketConfig extends BaseSchemaLess {
  @Prop({ type: Number, enum: MarketConfigStatus })
  status: MarketConfigStatus;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  nameKo: string;
}

export const MarketConfigSchema = SchemaFactory.createForClass(MarketConfig);
