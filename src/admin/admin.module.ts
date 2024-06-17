import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { WalletModule } from 'src/wallet/wallet.module';
import { MulterModule } from '@nestjs/platform-express';
import { CsvModule } from 'nest-csv-parser';
import { UserModule } from 'src/user/user.module';
import { ReferralModule } from 'src/referral/referral.module';
import { MailModule } from 'src/mail/mail.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { ChallengeModule } from 'src/challenge/challenge.module';
import { TradeModule } from 'src/trade/trade.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [
    WalletModule,
    CsvModule,
    MulterModule.register({
      dest: './uploads/csv',
    }),
    UserModule,
    ReferralModule,
    MailModule,
    TransactionModule,
    ChallengeModule,
    TradeModule,
  ],
})
export class AdminModule {}
