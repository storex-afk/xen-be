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

  @Prop({ default: false })
  deleted: boolean;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
