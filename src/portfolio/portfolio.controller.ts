import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('portfolio')
export class PortfolioController {
  @Post()
  async createPortfolio(@Body() body) {}

  @Get(':userId')
  async fetchPortfolios() {}
}
