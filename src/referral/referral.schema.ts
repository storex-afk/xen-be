import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Referral {
  @Prop({ unique: true })
  referralId: string;

  @Prop({ type: Types.ObjectId })
  userId: ObjectId;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
