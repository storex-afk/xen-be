import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { WalletModule } from 'src/wallet/wallet.module';
import { MulterModule } from '@nestjs/platform-express';
import { CsvModule } from 'nest-csv-parser';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [
    WalletModule,
    CsvModule,
    MulterModule.register({
      dest: './uploads/csv',
    }),
  ],
})
export class AdminModule {}
