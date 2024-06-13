import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { OtpService } from './otp/otp.service';

@Module({
  providers: [OtpService],
  exports: [CacheModule, OtpService],
  imports: [CacheModule.register('cache-manager-redis-yet')],
})
export class CommonModule {}
