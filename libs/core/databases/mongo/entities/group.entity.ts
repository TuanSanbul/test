import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'group',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Group extends BaseSchemaLess {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
