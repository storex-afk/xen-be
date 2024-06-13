import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

export enum AccountType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  fullName: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
  phoneNumber: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: AccountType.USER })
  accountType: AccountType;

  @Prop()
  password: string;

  @Prop()
  country: string;

  @Prop()
  profileImg: string;

  @Prop()
  termsOfService: boolean;

  //   belong to a user
  @Prop({ type: Types.ObjectId })
  refId: ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    this['profileImg'] =
      `https://ui-avatars.com/api/?background=ccf3ff&color=001F3F&name=${this['fullName']}`;
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
