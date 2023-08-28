import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../../base-entity';

@Schema({
  collection: 'top_leagues',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toJSON: {
    transform: function (_, ret) {
      delete ret._id;
    },
  },
})
export class TopLeagues extends BaseSchemaLess {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  nameKo: string;

  @Prop({ type: String, default: 1 })
  order?: string;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;

  @Prop({ type: String, default: null })
  imageUrl?: string | null;

  @Prop({ type: String, default: null })
  description?: string | null;

  @Prop({ type: Array, default: [] })
  leagues?: string[];
}
export const TopLeagueSchema = SchemaFactory.createForClass(TopLeagues);
