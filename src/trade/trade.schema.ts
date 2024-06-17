import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export enum TradeType {
  BUY = 'Buy',
  SELL = 'Sell',
}

@Schema({
  timestamps: true,
})
export class Trade {
  @Prop()
  side: string;

  @Prop({ type: Types.ObjectId })
  challengeId?: ObjectId;

  @Prop()
  openTime: Date;

  @Prop()
  openPrice: string;

  @Prop()
  closeTime: Date;

  @Prop()
  closePrice: string;
  @Prop()
  symbol: string;

  @Prop()
  volume: string;

  @Prop()
  profitOrLoss: string;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
