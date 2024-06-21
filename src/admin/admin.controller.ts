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
import { TradeService } from 'src/trade/trade.service';
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
    private tradeService: TradeService,
  ) {}

  @Get('confirm-transaction/:transactionId')
  async confirmDeposit(@Param('transactionId') transactionId) {
    const transaction = await this.transactionService.findOneByPayload({
      _id: transactionId,
    });
    const user = await this.userService.findOneByPayload({
      _id: transaction.userId,
    });

    if (
      transaction.type === TransactionType.DEPOSIT &&
      transaction.status !== TransactionStatus.SUCCESSFUL
    ) {
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
      if (user.refId) {
        const referral = await this.referralService.findOneByPayload({
          _id: user.refId,
        });
        const referralUser = await this.userService.findOneByPayload({
          _id: referral.userId,
        });
        await this.walletService.updateByPayload(
          { userId: referral.userId },
          { $inc: { balance: 0.03 * Number(transaction.amount) } },
        );
        // Here creating referral bonus and telling user about it
        const createdTransaction =
          await this.transactionService.createTransaction(
            {
              type: TransactionType.REF_BONUS,
              amount: 0.03 * Number(transaction.amount),
              status: TransactionStatus.SUCCESSFUL,
              userId: referral.userId,
            },
            null,
          );
        await this.emailService.sendReferralMail(
          referralUser.toObject(),
          createdTransaction.toObject(),
        );
      }

      return await this.emailService.sendTransactionStatus(user, {
        ...transaction.toObject(),
        status: TransactionStatus.SUCCESSFUL,
      });
    } else if (
      transaction.type === TransactionType.WITHDRAWAL &&
      transaction.status !== TransactionStatus.SUCCESSFUL
    ) {
      await this.transactionService.updateByPayload(
        { _id: transactionId },
        { status: TransactionStatus.SUCCESSFUL },
      );
      // await this.walletService.updateByPayload(
      //   { userId: user._id },
      //   { $inc: { balance: -Number(transaction.amount) } },
      // );
      return await this.emailService.sendTransactionStatus(user, {
        ...transaction.toObject(),
        status: TransactionStatus.SUCCESSFUL,
      });
    } else {
      // transaction already successful
      return { message: 'Transaction Already Confirmed' };
    }
  }

  @Get('decline-transaction/:transactionId/')
  async declineDeposit(@Param('transactionId') transactionId) {
    const transaction = await this.transactionService.findOneByPayload({
      _id: transactionId,
    });
    const user = await this.userService.findOneByPayload({
      _id: transaction.userId,
    });

    if (
      transaction.type === TransactionType.DEPOSIT &&
      transaction.status !== TransactionStatus.FAILED
    ) {
      await this.transactionService.updateByPayload(
        { _id: transactionId },
        { status: TransactionStatus.FAILED },
      );
      return await this.emailService.sendTransactionStatus(user, {
        ...transaction.toObject(),
        status: TransactionStatus.FAILED,
      });
    } else if (
      transaction.type === TransactionType.WITHDRAWAL &&
      transaction.status !== TransactionStatus.FAILED
    ) {
      await this.transactionService.updateByPayload(
        { _id: transactionId },
        { status: TransactionStatus.FAILED },
      );
      await this.walletService.updateByPayload(
        { userId: transaction.userId },
        {
          $inc: {
            balance: +Number(transaction.amount),
          },
        },
      );
      return await this.emailService.sendTransactionStatus(user, {
        ...transaction.toObject(),
        status: TransactionStatus.FAILED,
      });
    } else {
      return { message: 'Transaction Already decline' };
    }
  }
  @Get('users')
  async getUsers() {
    return await this.userService.getAll();
  }

  @Get('transactions')
  async getTransactions() {
    return await this.transactionService.getAll({});
  }

  @Get('user/:userId/challenge')
  async getUserPortfolio(@Param('userId') userId) {
    return await this.challengeService.getAll({ userId: new ObjectId(userId) });
  }

  @Get('user/:userId/challenge/:challengeId')
  async getUserPortfolioDetails(@Param() params) {
    return await this.challengeService.findOneByPayload({
      userId: new ObjectId(params.userId),
      _id: new ObjectId(params.challengeId),
    });
  }

  @Get('user/:userId/challenge/:challengeId/trades')
  async getUserPortfolioTrades(@Param() params) {
    return await this.tradeService.getAll({
      challengeId: params.challengeId,
    });
  }

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
  async blockUser(@Param('userId') userId, @Body('') body) {
    const user = await this.userService.findOneByPayload({
      _id: new ObjectId(userId),
    });
    await this.userService.updateByPayload(
      { _id: new ObjectId(userId) },
      { blocked: !body.blocked },
    );
    return await this.emailService.sendInformation(user, 'Blocked');
  }

  @Delete('user/:userId/delete')
  async deleteUser(@Param('userId') userId) {
    const user = await this.userService.findOneByPayload({ _id: userId });
    await this.userService.deleteByPayload({ _id: new ObjectId(userId) });
    await this.walletService.updateByPayload(
      { userId: new ObjectId(userId) },
      { deleted: true },
    );
    await this.referralService.updateByPayload(
      { userId: new ObjectId(userId) },
      { deleted: true },
    );
    return await this.emailService.sendInformation(user.toObject(), 'Deleted');
    // send email to user
  }

  @Put('balance/:userId')
  async updateBalance(@Body() body, @Param('userId') _id) {
    const userId = new ObjectId(_id);

    // Combine findOneByPayload and updateByPayload into a transaction
    if (body.type === 'loss') {
      this.challengeService.updateByPayload(
        { _id: new ObjectId(body.challenge) },
        { $inc: { loss: +Number(body.amount) } },
      );
      await this.walletService.updateByPayload(
        { userId: new ObjectId(userId) },
        { $inc: { balance: -Number(body.amount) } },
      );
    } else {
      this.challengeService.updateByPayload(
        { _id: new ObjectId(body.challenge) },
        { $inc: { profit: +Number(body.amount) } },
      );
      await this.walletService.updateByPayload(
        { userId: new ObjectId(userId) },
        { $inc: { balance: +Number(body.amount) } },
      );
    }
  }
}
