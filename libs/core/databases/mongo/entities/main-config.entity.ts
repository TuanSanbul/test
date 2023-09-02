import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'main_config',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class MainConfig extends BaseSchemaLess {
  @Prop({ type: String })
  companyName: string;

  @Prop({ type: String })
  realtimeNotice: string;

  @Prop({ type: Boolean })
  firstPointStatus: boolean;

  @Prop({ type: String })
  filterWord: string;

  @Prop({ type: String })
  prohibitedWord: string;

  @Prop({ type: String })
  memberConfigId: string;

  @Prop({ type: String })
  noticeConfigId: string;

  @Prop({ type: Number })
  limitComboQuantity: number;

  @Prop({ type: Number })
  limitComboOdds: number;

  @Prop({ type: Number })
  rechargeAmount: number;

  @Prop({ type: Boolean, default: true })
  isUseCouponItem: boolean;

  @Prop({ type: Boolean })
  isUseFirstChargeBonus: boolean;

  @Prop({ type: Number })
  firstChargePointBonus: number;

  @Prop({ type: Boolean })
  isFCMaxPointApply: boolean;

  @Prop({ type: Number })
  firstChargeMaxPoint: number;

  @Prop({ type: Boolean })
  isRCMaxPointApply: boolean;

  @Prop({ type: Number })
  RechargeMaxPoint: number;

  @Prop({ type: Boolean })
  isMaxCoinBonusApply: boolean;

  @Prop({ type: Number })
  firstChargeCoinBonus: number;

  @Prop({ type: Number })
  rechargeCoinBonus: number;
}
export const MainConfigSchema = SchemaFactory.createForClass(MainConfig);
