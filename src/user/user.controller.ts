import { Controller, Put, UseGuards, Request, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ObjectId } from 'mongodb';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Put()
  async updateUser(@Request() req, @Body() body) {
    return this.userService.patchUser(
      { _id: new ObjectId(req.user._id) },
      body,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUser(@Request() req) {
    return this.userService.findOneByPayload({
      _id: new ObjectId(req.user._id),
    });
  }
}
