import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaLess } from '../../base-entity';

@Schema({
  collection: 'bank',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Bank extends BaseSchemaLess {
  @Prop({ type: String })
  nameKo: string;

  @Prop({ type: Boolean })
  state: boolean;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
