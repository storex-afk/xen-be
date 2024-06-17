import { Injectable } from '@nestjs/common';
import { createReadStream, unlinkSync } from 'fs';
import * as csv from 'csv-parser';
import { ChallengeService } from 'src/challenge/challenge.service';
import { ObjectId } from 'mongodb';
import { WalletService } from 'src/wallet/wallet.service';
import { TradeService } from 'src/trade/trade.service';

@Injectable()
export class AdminService {
  constructor(
    private challengeService: ChallengeService,
    private walletService: WalletService,
    private tradeService: TradeService,
  ) {}
  async parse(file, payload) {
    if (!file) return;
    const results = [];

    createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        console.log(payload);
        const data = results.map((result) => {
          const { openPrice, closePrice, side, volume } = result;
          let profitOrLoss = 0;

          if (side === 'Buy') {
            profitOrLoss =
              (Number(closePrice) - Number(openPrice)) * Number(volume);
          } else if (side === 'Sell') {
            profitOrLoss =
              (Number(openPrice) - Number(closePrice)) * Number(volume);
          }
          return {
            ...result,
            userId: payload.userId,
            challengeId: payload.challengeId,
            profitOrLoss,
          };
        });

        await this.tradeService.insertBulk(data);

        const totalProfit = data.reduce(
          (acc, curr) => acc + (curr.profitOrLoss > 0 ? curr.profitOrLoss : 0),
          0,
        );
        const totalLoss = Math.abs(
          data.reduce(
            (acc, curr) =>
              acc + (curr.profitOrLoss < 0 ? curr.profitOrLoss : 0),
            0,
          ),
        );
        await this.challengeService.updateByPayload(
          {
            _id: new ObjectId(payload.challengeId),
          },
          { $inc: { profit: +totalProfit, loss: +totalLoss } },
        );
        const balance = totalProfit - totalLoss;

        await this.walletService.updateByPayload(
          { userId: new ObjectId(payload.userId) },
          { $inc: { balance: +balance } },
        );
        console.log(totalProfit, totalLoss);
        unlinkSync(file.path);
        return results;
      });
    return { message: 'Uploaded Successful' };
  }
}
