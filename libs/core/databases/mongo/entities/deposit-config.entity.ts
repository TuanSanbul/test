import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'deposit_config',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class DepositConfig extends BaseSchemaLess {
  @Prop({ type: String })
  mainConfigId: string;

  @Prop({ type: String })
  value: string;

  @Prop({ type: Number })
  memberRegisterLevel: number;

  @Prop({ type: String })
  memberRegisterGroup: string;
}

export const DepositConfigSchema = SchemaFactory.createForClass(DepositConfig);
