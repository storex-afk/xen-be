import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Wallet {
  @Prop()
  balance: number;

  @Prop({ type: Object })
  btcDetails: Record<string, any>;

  @Prop({ type: Object })
  ethDetails: Record<string, any>;

  @Prop({ type: Types.ObjectId })
  userId: ObjectId;

  @Prop({ default: false })
  deleted: boolean;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
