import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchemaLess } from '../../base-entity';

export type ICommunicateSetting = HydratedDocument<CommunicateSetting>;

@Schema({
  collection: 'communicate-setting',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class CommunicateSetting extends BaseSchemaLess {
  @Prop({ type: String })
  font: string;

  @Prop({ type: String })
  color: string;

  @Prop({ type: Number, nullable: true })
  top: number;

  @Prop({ type: Number, nullable: true })
  left: number;

  @Prop({ type: Number, nullable: true })
  mobileTop: number;

  @Prop({ type: Number, nullable: true })
  mobileLeft: number;

  @Prop({ type: String, nullable: true })
  notification: string;
}

export const CommunicateSettingSchema =
  SchemaFactory.createForClass(CommunicateSetting);
