import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ObjectId } from 'mongodb';

@Controller('challenge')
export class ChallengeController {
  constructor(private challengeService: ChallengeService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createChallenge(@Body() body, @Request() req) {
    return await this.challengeService.createChallenge({
      ...body,
      userId: new ObjectId(req.user._id),
    });
  }
  @UseGuards(AuthGuard)
  @Get('')
  async fetchChallenges(@Request() req) {
    return await this.challengeService.getAll({
      userId: new ObjectId(req.user._id),
    });
  }
  @UseGuards(AuthGuard)
  @Get(':challengeId')
  async fetchChallengeById(@Request() req, @Param('challengeId') challengeId) {
    return await this.challengeService.findOneByPayload({
      _id: new ObjectId(challengeId),
    });
  }
}
