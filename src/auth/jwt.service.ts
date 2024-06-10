import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomJwtService {
  constructor(private jwtService: JwtService) {}

  async signPayload(payload, expiresIn?: string | number) {
    const options = expiresIn
      ? { secret: process.env.SECRET_KEY, expiresIn }
      : { secret: process.env.SECRET_KEY };
    return await this.jwtService.signAsync(payload, options);
  }

  async decode(payload) {
    return await this.jwtService.decode(payload);
  }

  async verify(payload) {
    if (!payload) throw new Error('Invalid Token');

    const expirationTime = payload.exp * 1000; // Convert to milliseconds

    // // Compare the current time with the expiration time
    const isExpired = Date.now() > expirationTime;

    return isExpired;
  }
}
