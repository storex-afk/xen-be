import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Post()
  async createTransaction(@Body() body) {
    this.transactionService.createTransaction(body);
  }
}
