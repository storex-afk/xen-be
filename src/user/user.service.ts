import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
export interface BUserFindOneByPayload {
  _id?: any;
  email?: string;
  username?: string;
  phoneNumber?: string;
}

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
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
    return await this.userModel.findOne(payload);
  }

  async deleteByPayload(payload: BUserFindOneByPayload) {
    return await this.userModel.findOneAndDelete(payload);
  }

  sanitizeUser(user) {
    const sanitized = user;
    delete sanitized['password'];
    return sanitized;
  }

  async getAll() {}
}
