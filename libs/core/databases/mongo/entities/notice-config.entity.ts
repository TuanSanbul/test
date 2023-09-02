import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'notice_config',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class NoticeConfig extends BaseSchemaLess {
  @Prop({ type: Boolean })
  isUseNotice: boolean;

  @Prop({ type: String })
  noticeTitle: string;

  @Prop({ type: String })
  noticeMessage: string;
}

export const NoticeConfigSchema = SchemaFactory.createForClass(NoticeConfig);
