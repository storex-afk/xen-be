import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ObjectId } from 'mongodb';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUserReferralDetails(@Request() req) {
    return await this.referralService.getReferralDetails({
      userId: new ObjectId(req.user._id),
    });
  }
}
