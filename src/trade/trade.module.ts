import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TradeSchema } from './trade.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trade', schema: TradeSchema }]),
  ],
  providers: [TradeService],
  controllers: [TradeController],
  exports: [TradeService],
})
export class TradeModule {}
