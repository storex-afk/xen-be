import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ReferralModule } from 'src/referral/referral.module';
import { CustomJwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    ReferralModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '10h' },
    }),
  ],
  providers: [AuthService, CustomJwtService],
  controllers: [AuthController],
})
export class AuthModule {}
