import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from './user.schema';
export interface BUserFindOneByPayload {
  _id?: ObjectId;
  email?: string;
  username?: string;
}

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async saveData(payload) {
    const createdUser = new this.userModel(payload);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async updateByPayload() {}

  async findOneByPayload(payload: BUserFindOneByPayload) {
    return await this.userModel.findOne(payload);
  }

  sanitizeUser(user) {
    const sanitized = user;
    delete sanitized['password'];
    return sanitized;
  }

  async getAll() {}
}
