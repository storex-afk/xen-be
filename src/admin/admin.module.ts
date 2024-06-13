import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [WalletModule],
})
export class AdminModule {}
