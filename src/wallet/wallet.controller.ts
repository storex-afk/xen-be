import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { WalletService } from './wallet.service';
import { ObjectId } from 'mongodb';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}
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
}
