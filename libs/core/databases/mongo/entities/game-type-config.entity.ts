import { EGameTypeConfig } from '@lib/common/enums/game-type-config.enum';
import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'game_type_config',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class GameTypeConfig extends BaseSchemaLess {
  @Prop({ type: Number })
  level: number;

  @Prop({ type: Number })
  maxWinning: number;

  @Prop({ type: Number })
  maxBet: number;

  @Prop({ type: String, enum: EGameTypeConfig })
  type: EGameTypeConfig;

  @Prop({ type: String })
  gameTypeId: string;
}

export const GameTypeConfigSchema =
  SchemaFactory.createForClass(GameTypeConfig);
