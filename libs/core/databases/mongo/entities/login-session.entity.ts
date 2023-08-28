import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchemaLess } from '../../base-entity';

export type ILoginSession = HydratedDocument<LoginSession>;

@Schema({
  collection: 'login_session',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class LoginSession extends BaseSchemaLess {
  @Prop({ type: String })
  memberId: string;

  @Prop({ type: String })
  deviceId: string;

  @Prop({ type: String })
  userAgent: string;

  @Prop({ type: String })
  secretKey: string;

  @Prop({ nullable: true })
  expiredAt: Date;

  @Prop({ type: String })
  ipAddress: string;

  @Prop({ type: String, nullable: true })
  lat: string;

  @Prop({ type: String, nullable: true })
  long: string;

  @Prop({ type: String, nullable: true })
  country: string;

  @Prop({ type: String })
  refreshToken: string;
}

export const LoginSessionSchema = SchemaFactory.createForClass(LoginSession);
