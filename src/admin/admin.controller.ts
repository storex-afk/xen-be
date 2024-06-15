import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  UploadedFile,
  Delete,
  Body,
} from '@nestjs/common';
import { WalletService } from 'src/wallet/wallet.service';
import { ObjectId } from 'mongodb';
import { FileInterceptor } from '@nestjs/platform-express';
// import { memoryStorage } from 'multer';
import { AdminService } from './admin.service';
import { UserService } from 'src/user/user.service';
import { ReferralService } from 'src/referral/referral.service';
import { MailService } from 'src/mail/mail.service';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  TransactionStatus,
  TransactionType,
} from 'src/transaction/transaction.schema';
import { ChallengeService } from 'src/challenge/challenge.service';
import { ChallengeStatus } from 'src/challenge/challenge.schema';
@Controller('admin')
export class AdminController {
  constructor(
    private walletService: WalletService,
    private adminService: AdminService,
    private userService: UserService,
    private referralService: ReferralService,
    private emailService: MailService,
    private transactionService: TransactionService,
    private challengeService: ChallengeService,
  ) {}

  @Get('confirm-transaction/:transactionId')
  async confirmDeposit(@Param('transactionId') transactionId) {
    const transaction = await this.transactionService.findOneByPayload({
      _id: transactionId,
    });
    const user = await this.userService.findOneByPayload({
      _id: transaction.userId,
    });

    const referral = await this.referralService.findOneByPayload({
      _id: user.refId,
    });

    if (transaction.type === TransactionType.DEPOSIT) {
      await this.transactionService.updateByPayload(
        { _id: transactionId },
        { status: TransactionStatus.SUCCESSFUL },
      );
      // update challenge
      await this.challengeService.updateByPayload(
        { _id: transaction.challengeId },
        { status: ChallengeStatus.ONGOING },
      );
      //give 5% to referred person
      if (referral) {
        await this.walletService.updateByPayload(
          { userId: referral.userId },
          { $inc: { balance: 0.05 * Number(transaction.amount) } },
        );
        await this.transactionService.createTransaction({
          type: TransactionType.REF_BONUS,
          amount: 0.05 * Number(transaction.amount),
          status: TransactionStatus.SUCCESSFUL,
          userId: referral.userId,
        });
      }
    } else {
      await this.transactionService.updateByPayload(
        { _id: transactionId },
        { status: TransactionStatus.SUCCESSFUL },
      );
      await this.walletService.updateByPayload(
        { userId: user._id },
        { $inc: { balance: -Number(transaction.amount) } },
      );
    }
    // TODO:  move to bull mq
    return await this.emailService.sendTransactionStatus(user, {
      ...transaction,
      status: TransactionStatus.SUCCESSFUL,
    });
  }
  @Get('decline-transaction/:transactionId/')
  async declineDeposit(@Param('transactionId') transactionId) {
    const transaction = await this.transactionService.findOneByPayload({
      _id: transactionId,
    });
    const user = await this.userService.findOneByPayload({
      _id: transaction.userId,
    });

    if (transaction.type === TransactionType.DEPOSIT) {
      await this.transactionService.updateByPayload(
        { _id: transactionId },
        { status: TransactionStatus.FAILED },
      );
    } else {
      await this.transactionService.updateByPayload(
        { _id: transactionId },
        { status: TransactionStatus.FAILED },
      );
    }
    return await this.emailService.sendTransactionStatus(user, {
      ...transaction,
      status: TransactionStatus.FAILED,
    });
    // send email to user about transaction it was either not confirm or confirmed
  }
  @Get('users')
  async getUsers() {}

  @Get('user/:userId/challenge')
  async getUserPortfolio() {}

  @Put('user/:userId/challenge/:challengeId')
  async updateUserPortfolio() {}

  @Post('user/:userId/challenge/:challengeId/trade')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 1024 * 1024 * 5 }, // 1 MB you can adjust size here
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['text/csv'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(new BadRequestException('Invalid file type'), false);
        } else if (file?.size > 1024 * 1024 * 5) {
          // 1MB
          cb(
            new BadRequestException('Max File Size Reached. Max Allowed: 1MB'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadCsvFile(
    @UploadedFile() file: Express.Multer.File,
    @Param() params,
  ): Promise<any> {
    try {
      return await this.adminService.parse(file, params);
    } catch (e) {
      throw new InternalServerErrorException(
        e?.message || 'Internal Server Error',
      );
    }
  }

  @Post('create-wallet/:userId')
  async getWallet(@Param('userId') userId) {
    return await this.walletService.createWallet(new ObjectId(userId));
  }

  @Put('user/:userId/block')
  async blockUser(@Param('userId') userId, @Body('blocked') blocked) {
    const user = await this.userService.findOneByPayload({ _id: userId });
    await this.emailService.sendInformation(user, 'Blocked');

    return await this.userService.updateByPayload(
      { _id: userId },
      { blocked: !blocked },
    );
  }

  @Delete('user/:userId/delete')
  async deleteUser(@Param('userId') userId) {
    const user = await this.userService.findOneByPayload({ _id: userId });
    await this.userService.deleteByPayload({ _id: userId });
    await this.walletService.updateByPayload({ userId }, { deleted: true });
    await this.referralService.updateByPayload({ userId }, { deleted: true });
    return await this.emailService.sendInformation(user, 'Deleted');
    // send email to user
  }
}
