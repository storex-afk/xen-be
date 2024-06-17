import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private tradeService: TradeService) {}
  @UseGuards(AuthGuard)
  @Get(':challengeId')
  async fetchTrades(@Param() params) {
    return this.tradeService.getAll({ challengeId: params.challengeId });
  }
}
