import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  generateOTP(n: number): string {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < n; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }

    return otp;
  }
}
