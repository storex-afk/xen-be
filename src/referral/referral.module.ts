import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralSchema } from './referral.schema';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { UserSchema } from 'src/user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Referral', schema: ReferralSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [ReferralService],
  exports: [ReferralService],
  controllers: [ReferralController],
})
export class ReferralModule {}
