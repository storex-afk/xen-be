import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from './transaction.schema';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('Transaction') private transactionModel: Model<Transaction>,
    private mailService: MailService,
  ) {}

  async createTransaction(payload) {
    const transaction = new this.transactionModel(payload);
    await transaction.save();
    if (payload.type == TransactionType.DEPOSIT) {
      // send email to admin
      await this.mailService.sendTransactionConfirm(transaction);
    } else {
      // send email to admin
      // attach user wallet
      await this.mailService.sendTransactionConfirm(transaction);
    }
    return transaction;
  }

  async updateByPayload(payload, data) {
    const update = await this.transactionModel.findOneAndUpdate(payload, data, {
      new: true,
    });
    return update;
  }

  async findOneByPayload(payload) {
    return await this.transactionModel.findOne(payload).exec();
  }

  async getAll(payload) {
    return await this.transactionModel.find(payload).exec();
  }

  async confirm(payload) {
    const transaction = await this.findOneByPayload(payload);
    return {
      status:
        transaction.status == TransactionStatus.PENDING
          ? TransactionStatus.PENDING
          : transaction.status == TransactionStatus.FAILED
            ? TransactionStatus.FAILED
            : TransactionStatus.SUCCESSFUL,
    };
  }
}
