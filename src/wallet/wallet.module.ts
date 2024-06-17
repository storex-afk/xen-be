import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema } from './wallet.schema';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Wallet', schema: WalletSchema }]),
    TransactionModule,
  ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
