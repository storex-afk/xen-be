import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReferralSchema } from './referral.schema';
import { ReferralService } from './referral.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Referral', schema: ReferralSchema }]),
  ],
  providers: [ReferralService],
  exports: [ReferralService],
})
export class ReferralModule {}
