import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EGameType, EUserType } from '@lib/common/enums';
import { BaseSchemaLess } from '../../base-entity';

@Schema({
  collection: 'game_config',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class GameConfig extends BaseSchemaLess {
  @Prop({ type: String, enum: EUserType })
  userType: EUserType;

  @Prop({ type: String, enum: EGameType })
  gameType: EGameType;

  @Prop({ type: Boolean })
  status: boolean;

  @Prop({ type: Date })
  applyDate: Date;

  @Prop({ type: String })
  mainConfigId: string;
}

export const GameConfigSchema = SchemaFactory.createForClass(GameConfig);
