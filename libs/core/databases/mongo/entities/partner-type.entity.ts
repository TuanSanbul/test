import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../../base-entity';

@Schema({
  collection: 'partner_type',
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
export class PartnerType extends BaseSchemaLess {
  @Prop({ type: Number })
  level: number;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String, default: null })
  rate: string | null;

  @Prop({ type: Number, default: 1 })
  order?: number;

  @Prop({ type: String, required: false })
  description?: string;
}
export const PartnerTypeSchema = SchemaFactory.createForClass(PartnerType);
