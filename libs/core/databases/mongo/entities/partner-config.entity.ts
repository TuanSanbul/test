import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../../base-entity';

@Schema({
  collection: 'partner_config',
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
export class PartnerConfig extends BaseSchemaLess {
  @Prop({ type: String, required: true })
  memberId: string;

  @Prop({ type: String, required: true })
  partnerTypeId: string;

  @Prop({ type: String })
  description: string;
}
export const PartnerConfigSchema = SchemaFactory.createForClass(PartnerConfig);
