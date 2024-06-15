import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ObjectId } from 'mongodb';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createTransaction(@Body() body, @Request() req) {
    return await this.transactionService.createTransaction({
      ...body,
      userId: new ObjectId(req.user._id),
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  async getTransactions(@Request() req) {
    return await this.transactionService.getAll({
      userId: new ObjectId(req.user._id),
    });
  }

  @UseGuards(AuthGuard)
  @Get('confirm/:transactionId')
  async confirmTransactions(
    @Request() req,
    @Param('transactionId') transactionId,
  ) {
    return await this.transactionService.confirm({
      _id: new ObjectId(transactionId),
    });
  }
}
