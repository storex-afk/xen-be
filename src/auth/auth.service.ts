import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ReferralService } from 'src/referral/referral.service';
import { CustomJwtService } from './jwt.service';
import { CacheService } from 'src/common/cache/cache.service';
import { OtpService } from 'src/common/otp/otp.service';
import { MailService } from 'src/mail/mail.service';
import { ObjectId } from 'mongodb';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private referralService: ReferralService,
    private jwtService: CustomJwtService,
    private cacheService: CacheService,
    private otpService: OtpService,
    private mailService: MailService,
    private walletService: WalletService,
  ) {}

  async register(payload) {
    const { email, password, username, ref, country, fullName, phoneNumber } =
      payload;
    const lowerCaseEmail = email.toLowerCase();
    const lowerCaseUsername = username.toLowerCase();
    const user = await this.userService.findOneByPayload({
      email: lowerCaseEmail,
    });
    const userNameExist = await this.userService.findOneByPayload({
      username: lowerCaseUsername,
    });
    const phoneNumberExist = await this.userService.findOneByPayload({
      phoneNumber,
    });
    if (user) {
      throw new ConflictException('User already exists');
    } else if (userNameExist) {
      throw new ConflictException('Username already exists');
    } else if (phoneNumberExist) {
      throw new ConflictException('Phone Number already exists');
    } else {
      let createdUser;
      if (ref) {
        const referral = await this.referralService.checkReferral({
          referralId: ref.toLowerCase(),
        });
        createdUser = await this.userService.saveData({
          email: lowerCaseEmail,
          country,
          refId: referral._id,
          username: lowerCaseUsername,
          password,
          fullName,
          phoneNumber,
        });
        await this.referralService.saveData({
          referralId: lowerCaseUsername,
          userId: createdUser._id,
        });
      } else {
        createdUser = await this.userService.saveData({
          fullName,
          email: lowerCaseEmail,
          country,
          username: lowerCaseUsername,
          password,
          phoneNumber,
        });
        await this.referralService.saveData({
          referralId: lowerCaseUsername,
          userId: createdUser._id,
        });
      }
      const token = this.otpService.generateOTP(6);
      await this.cacheService.set(
        `verification:${createdUser._id}`,
        token,
        300,
      );
      await this.mailService.sendUserConfirmation(createdUser, token);
      return createdUser;
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
      return {
        user: { ...this.userService.sanitizeUser(user.toJSON()) },
        token: await this.jwtService.signPayload({
          email: user.email,
          accountType: user.accountType,
          _id: user && user?._id,
        }),
      };
    } else {
      throw new HttpException('Invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword(payload) {
    const user = await this.userService.findOneByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid Email Address', HttpStatus.BAD_REQUEST);
    } else {
      const token = await this.otpService.generateOTP(6);
      // store to redis
      await this.cacheService.set(
        `password:${user._id.toString()}`,
        token,
        300,
      );
      await this.mailService.sendForgotConfirmation(user, token);
      return user;
    }
  }
  async resetPassword(payload) {
    const { token, password, id } = payload;
    const decodedToken = await this.cacheService.get(`password:${id}`);
    if (!decodedToken) {
      throw new HttpException('Request New token', HttpStatus.BAD_REQUEST);
    } else if (token !== decodedToken) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    } else {
      await this.cacheService.del(`password:${id}`);
      const foundUser = await this.userService.findOneByPayload({
        _id: new ObjectId(id),
      });

      // Hash the new password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user with the hashed password
      const update = await this.userService.updateByPayload(
        { _id: foundUser._id },
        {
          password: hashedPassword,
        },
      );
      return update;
    }
  }

  async confirmAccount(payload) {
    const { token, id } = payload;
    const decodedToken = await this.cacheService.get(`verification:${id}`);
    if (!decodedToken) {
      //generate new token and send

      throw new HttpException("Token Doesn't exist", HttpStatus.BAD_REQUEST);
    } else if (token !== decodedToken) {
      throw new HttpException('Bad Token', HttpStatus.BAD_REQUEST);
    } else {
      await this.cacheService.del(`verification:${id}`);
      const foundUser = await this.userService.findOneByPayload({
        _id: new ObjectId(id),
      });
      const update = await this.userService.updateByPayload(
        { _id: foundUser._id },
        {
          isVerified: true,
        },
      );
      return this.userService.sanitizeUser(update);
    }
  }

  async resendOtp(payload) {
    console.log(payload);
  }
}
