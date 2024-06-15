import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export enum TransactionType {
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT',
  REF_BONUS = 'REF BONUS',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
}

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop()
  type: TransactionType;

  @Prop({ default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Prop({})
  reason: string;

  @Prop({})
  amount: string;

  @Prop({ type: Types.ObjectId })
  challengeId?: ObjectId;

  @Prop({ type: Types.ObjectId })
  userId: ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
