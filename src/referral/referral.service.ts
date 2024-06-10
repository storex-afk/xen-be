import { NotFoundException, Injectable } from '@nestjs/common';
import { Referral } from './referral.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ReferralService {
  constructor(
    @InjectModel('Referral') private referralModel: Model<Referral>,
  ) {}

  async saveData(payload) {
    const createdReferral = new this.referralModel(payload);
    await createdReferral.save();
    return createdReferral;
  }

  async checkReferral(payload) {
    const referral = await this.referralModel.findOne(payload);
    //If referral is not found, throw error.
    if (!referral) {
      throw new NotFoundException('Invalid Referral');
    }
    return referral;
  }
}
