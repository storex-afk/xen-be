import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade } from './trade.schema';

@Injectable()
export class TradeService {
  constructor(@InjectModel('Trade') private tradeModel: Model<Trade>) {}

  async insertBulk(data) {
    await this.tradeModel.insertMany(data);
  }

  async findOneByPayload(payload) {
    return await this.tradeModel.findOne(payload).exec();
  }

  async getAll(payload) {
    return await this.tradeModel.find(payload).exec();
  }
}
