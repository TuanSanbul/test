import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../../base-entity';

@Schema({
  collection: 'coupon_items',
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
export class CouponItems extends BaseSchemaLess {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false, default: '' })
  description?: string;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number, required: true })
  rate: number;

  @Prop({ type: Number, required: true })
  term: number;

  @Prop({ type: Number, min: 1, required: true })
  itemIndex: number;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: String })
  unit: string;
}

export const CouponItemsSchema = SchemaFactory.createForClass(CouponItems);
