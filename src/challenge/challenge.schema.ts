import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export enum ChallengeStatus {
  COMPLETED = 'COMPLETED',
  ONGOING = 'ONGOING',
  BREACHED = 'BREACHED',
  PENDING = 'PENDING',
}
@Schema({
  timestamps: true,
})
export class Challenge {
  @Prop()
  type: string;

  @Prop({ default: 0 })
  profit: number;

  @Prop({ default: 0 })
  loss: number;

  @Prop({ default: 0 })
  amount: number;

  @Prop({ default: ChallengeStatus.PENDING })
  status: ChallengeStatus;

  //   belong to a user
  @Prop({ type: Types.ObjectId })
  userId: ObjectId;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
