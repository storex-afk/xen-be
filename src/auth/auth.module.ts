import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ReferralModule } from 'src/referral/referral.module';
import { CustomJwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { MailModule } from 'src/mail/mail.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    UserModule,
    ReferralModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '10h' },
    }),
    CommonModule,
    MailModule,
    WalletModule,
  ],
  providers: [AuthService, CustomJwtService],
  controllers: [AuthController],
})
export class AuthModule {}
