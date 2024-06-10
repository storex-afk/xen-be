import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ReferralService } from 'src/referral/referral.service';
import { CustomJwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private referralService: ReferralService,
    private jwtService: CustomJwtService,
  ) {}

  async register(payload) {
    const { email, password, username, ref, country, fullName } = payload;
    const user = await this.userService.findOneByPayload({
      email: email.toLowerCase(),
    });
    const userNameExist = await this.userService.findOneByPayload({
      username: username.toLowerCase(),
    });

    if (user) {
      throw new ConflictException('User already exists');
    } else if (userNameExist) {
      throw new ConflictException('Username already exists');
    } else {
      if (ref) {
        const referral = await this.referralService.checkReferral({
          referralId: ref.toLowerCase(),
        });
        const createdUser = await this.userService.saveData({
          email: email.toLowerCase(),
          country,
          refId: referral._id,
          username: username.toLowerCase(),
          password,
          fullName,
        });
        await this.referralService.saveData({
          referralId: username.toLowerCase(),
          userId: createdUser._id,
        });
      } else {
        const createdUser = await this.userService.saveData({
          fullName,
          email: email.toLowerCase(),
          country,
          username: username.toLowerCase(),
          password,
        });
        await this.referralService.saveData({
          referralId: username.toLowerCase(),
          userId: createdUser._id,
        });
      }

      //send notification to welcome and confirm email
    }
  }

  async login(payload) {
    const { email, password } = payload;
    const user = await this.userService.findOneByPayload({
      email: email.toLowerCase(),
    });
    if (!user) {
      throw new HttpException("User doesn't exists", HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      const sanitizedUser = this.userService.sanitizeUser(user);
      return {
        sanitizedUser,
        token: await this.jwtService.signPayload(sanitizedUser),
      };
    } else {
      throw new HttpException('Invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword(payload) {
    const { email } = payload;
    const user = await this.userService.findOneByPayload({
      email: email.toLowerCase(),
    });
    if (!user) throw new NotFoundException('Invalid Email Address');

    //generate 6 digit code 

    // send otp to user email 
  }
  async resetPassword() {}

  async confirmAccount(payload) {
    const { token, id } = payload;

  }
}
