import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Post()
  async createTransaction(@Body() body) {
    return await this.transactionService.createTransaction(body);
  }

  @UseGuards(AuthGuard)
  @Get()
  async getTransactions(@Request() req) {
    return await this.transactionService.getAll({ userId: req.user._id });
  }
}
