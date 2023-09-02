import { CommunicateTemplateEnum } from '@lib/common/enums/communicate.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchemaLess } from '../../base-entity';

export type ICommunicateTemplate = HydratedDocument<CommunicateTemplate>;

@Schema({
  collection: 'communicate-template',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class CommunicateTemplate extends BaseSchemaLess {
  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  content: string;

  @Prop({ type: String, enum: CommunicateTemplateEnum })
  type: CommunicateTemplateEnum;

  @Prop({ type: String, nullable: true })
  fileUrl: string;

  @Prop({ type: Boolean, nullable: true })
  status: boolean;
}

export const CommunicateTemplateSchema =
  SchemaFactory.createForClass(CommunicateTemplate);
