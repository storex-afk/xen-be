import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet } from './wallet.schema';

export interface BWalletFindOneByPayload {
  _id?: Types.ObjectId | string;
  userId?: any;
}

@Injectable()
export class WalletService {
  constructor(@InjectModel('Wallet') private walletModel: Model<Wallet>) {}

  async createWallet(userId: Types.ObjectId) {
    const wallet = new this.walletModel({
      userId,
      btcDetails: {
        address: '',
        network: '',
      },
      ethDetails: {
        address: '',
        network: '',
      },
      balance: 0,
    });
    await wallet.save();
    return wallet;
  }

  async updateByPayload(payload, data) {
    const update = await this.walletModel.findOneAndUpdate(payload, data, {
      new: true,
    });
    return update;
  }

  async findOneByPayload(payload: BWalletFindOneByPayload) {
    return await this.walletModel.findOne(payload).exec();
  }
}
