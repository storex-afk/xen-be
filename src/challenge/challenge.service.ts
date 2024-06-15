import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './challenge.schema';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private challengeModel: Model<Challenge>,
    private emailService: MailService,
    private userService: UserService,
  ) {}

  async createChallenge(payload) {
    const challenge = new this.challengeModel(payload);
    await challenge.save();
    const user = await this.userService.findOneByPayload({
      _id: challenge.userId,
    });
    //send email to user concerning challenge
    await this.emailService.sendChallengeEmail(user, challenge);
    return challenge;
  }

  async getAll(payload) {
    return await this.challengeModel.find(payload).exec();
  }

  async updateByPayload(payload, data) {
    const update = await this.challengeModel.findOneAndUpdate(payload, data, {
      new: true,
    });
    return update;
  }

  async findOneByPayload(payload) {
    return await this.challengeModel.findOne(payload).exec();
  }
}
