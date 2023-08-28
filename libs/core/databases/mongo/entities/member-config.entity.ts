import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'member_config',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class MemberConfig extends BaseSchemaLess {
  @Prop({ type: Boolean })
  isAcceptRegisterMember: boolean;

  @Prop({ type: Boolean })
  isInstantApproval: boolean;

  @Prop({ type: Boolean })
  isSignUpLetter: boolean;

  @Prop({ type: Number })
  maximumRating: number;

  @Prop({ type: String })
  messageWelcome: string;

  @Prop({ type: String })
  messageReply: string;

  @Prop({ type: Number })
  memberRegisterLevel: number;

  @Prop({ type: String })
  memberRegisterGroup: string;

  @Prop({ type: String })
  memberRegisterRole: string;
}

export const MemberConfigSchema = SchemaFactory.createForClass(MemberConfig);
