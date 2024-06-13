import { Controller, Get, Post, Put, Param } from '@nestjs/common';
import { WalletService } from 'src/wallet/wallet.service';
import { ObjectId } from 'mongodb';

@Controller('admin')
export class AdminController {
  constructor(private walletService: WalletService) {}

  @Post('confirm-deposit/:id')
  async confirmDeposit() {}

  @Post('confirm-withdrawal/:id')
  async confirmWithdrawal() {}

  @Get('users')
  async getUsers() {}

  @Get('user/:userId/portfolios')
  async getUserPortfolio() {}

  @Put('user/:userId/portfolios/:portfolioId')
  async updateUserPortfolio() {}

  @Post('create-wallet/:userId')
  async getWallet(@Param('userId') userId) {
    return await this.walletService.createWallet(new ObjectId(userId));
  }
}
