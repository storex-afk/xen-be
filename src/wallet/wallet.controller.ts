import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { WalletService } from './wallet.service';
import { ObjectId } from 'mongodb';
import { TransactionService } from 'src/transaction/transaction.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private walletService: WalletService,
    private transactionService: TransactionService,
  ) {}
  @UseGuards(AuthGuard)
  @Put('btc')
  async btcWallet(@Body() body, @Request() req) {
    return await this.walletService.updateByPayload(
      { userId: new ObjectId(req.user._id) },
      { btcDetails: { ...body } },
    );
  }
  @UseGuards(AuthGuard)
  @Put('eth')
  async ethWallet(@Body() body, @Request() req) {
    return await this.walletService.updateByPayload(
      { userId: new ObjectId(req.user._id) },
      { ethDetails: { ...body } },
    );
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getWallet(@Request() req) {
    return await this.walletService.findOneByPayload({
      userId: new ObjectId(req.user._id),
    });
  }

  @UseGuards(AuthGuard)
  @Post('withdraw')
  async withdraw(@Body() body, @Request() req) {
    const userId = new ObjectId(req.user._id);

    // Combine findOneByPayload and updateByPayload into a transaction
    const wallet = await this.walletService.updateByPayload(
      { userId: new ObjectId(userId) },
      { $inc: { balance: -Number(body.amount) } },
    );

    const transaction = await this.transactionService.createTransaction(
      {
        ...body,
        userId,
      },
      wallet.toObject(),
    );

    return transaction;
  }
}
