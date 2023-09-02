import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'bulletin_bonus',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class BulletinBonus extends BaseSchemaLess {
  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  reward: number;

  @Prop({ type: String })
  mainConfigId: string;
}
export const BulletinBonusSchema = SchemaFactory.createForClass(BulletinBonus);
