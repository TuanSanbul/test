import { BaseSchemaLess } from '../../base-entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'attendance_bonus',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class AttendanceBonus extends BaseSchemaLess {
  @Prop({ type: Number })
  daysOfAttendance: number;

  @Prop({ type: Number })
  reward: number;

  @Prop({ type: String })
  mainConfigId: string;
}
export const AttendanceBonusSchema =
  SchemaFactory.createForClass(AttendanceBonus);
