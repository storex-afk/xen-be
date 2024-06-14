import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChallengeService } from './challenge.service';

@Controller('challenge')
export class ChallengeController {
  constructor(private challengeService: ChallengeService) {}
  @Post()
  async createChallenge(@Body() body) {
    return await this.challengeService.createChallenge(body);
  }

  @Get(':userId')
  async fetchPortfolios() {}
}
