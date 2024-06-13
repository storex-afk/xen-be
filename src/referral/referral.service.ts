import { NotFoundException, Injectable } from '@nestjs/common';
import { Referral } from './referral.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { ObjectId } from 'mongodb';
@Injectable()
export class ReferralService {
  constructor(
    @InjectModel('Referral') private referralModel: Model<Referral>,
    @InjectModel('User') private userModel: Model<User>,
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

  async getReferralDetails(payload) {
    const referralDetails = await (
      await this.referralModel.findOne(payload)
    ).toJSON();
    const referrals = await this.userModel
      .aggregate([
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              refId: new ObjectId(referralDetails._id),
            },
        },
      ])
      .exec();
    return {
      ...referralDetails,
      referrals,
    };
  }
}
