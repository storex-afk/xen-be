import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export enum AccountType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum PortfolioStatus {
  COMPLETED = 'COMPLETED',
  ONGOING = 'ONGOING',
  BREACHED = 'BREACHED',
  PENDING = 'PENDING',
}
@Schema({
  timestamps: true,
})
export class Portfolio {
  @Prop()
  type: string;

  @Prop({})
  profit: number;

  @Prop({})
  loss: number;

  @Prop({})
  amount: number;

  //   belong to a user
  @Prop({ type: Types.ObjectId })
  userId: ObjectId;
}

export const PortfolioSchema = SchemaFactory.createForClass(Portfolio);
