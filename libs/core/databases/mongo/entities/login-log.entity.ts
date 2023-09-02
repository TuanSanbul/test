import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchemaLess } from '../../base-entity';

export type ILoginLog = HydratedDocument<LoginLog>;

@Schema({
  collection: 'login_log',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class LoginLog extends BaseSchemaLess {
  @Prop({ type: String })
  memberId: string;

  @Prop({ type: String })
  deviceId: string;

  @Prop({ type: String })
  deviceType: string;

  @Prop({ type: String })
  userAgent: string;

  @Prop({ type: String })
  ipAddress: string;

  @Prop({ type: Boolean })
  status: boolean;
}

export const LoginLogSchema = SchemaFactory.createForClass(LoginLog);
