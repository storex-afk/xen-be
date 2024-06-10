import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() body) {
    return await this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body) {
    return await this.authService.login(body);
  }

  @Post('forgot password')
  async forgotPassword(@Body() body) {
    return await this.authService.forgotPassword(body);
  }

  @Put()
  async resetPassword() {}
}
