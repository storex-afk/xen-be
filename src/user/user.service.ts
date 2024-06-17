import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { ReferralService } from 'src/referral/referral.service';
export interface BUserFindOneByPayload {
  _id?: any;
  email?: string;
  username?: string;
  phoneNumber?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private referralService: ReferralService,
  ) {}
  async saveData(payload) {
    const createdUser = new this.userModel(payload);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async updateByPayload(payload, data) {
    const update = await this.userModel.findOneAndUpdate(payload, data, {
      new: true,
    });
    return update;
  }

  async findOneByPayload(payload: BUserFindOneByPayload) {
    return await this.userModel.findOne(payload).exec();
  }

  async deleteByPayload(payload: BUserFindOneByPayload) {
    return await this.userModel.findOneAndDelete(payload).exec();
  }

  sanitizeUser(user) {
    const sanitized = user;
    delete sanitized['password'];
    return sanitized;
  }

  async getAll() {
    return await this.userModel.find().exec();
  }

  async patchUser(payload, data) {
    try {
      const user = await this.updateByPayload(payload, data);
      await this.referralService.updateByPayload(
        { userId: user._id },
        {
          referralId: user.username,
        },
      );
      return user;
    } catch (err) {
      console.log(err.message);
      if (err.message.includes('duplicate key error collection')) {
        throw new HttpException(
          'username already exist',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw err;
      }
    }
  }
}
