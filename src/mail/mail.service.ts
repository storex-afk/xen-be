import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { APP_CONSTANT } from 'src/constant';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user, token: string) {
    const url = `${
      APP_CONSTANT.appUrl
    }/auth/confirm-account?token=${token}&id=${user._id.toString()}`;
    try {
      console.log(user, token);
      await this.mailerService.sendMail({
        to: user.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Welcome',
        template: './confirmation', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: user.fullName,
          url,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async resendConfirmation(user, token: string) {
    const url = `${
      APP_CONSTANT.appUrl
    }/auth/confirm-account?token=${token}&id=${user._id.toString()}`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `Confirm Email`,
      template: './verification', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.fullName,
        url,
      },
    });
  }

  async sendForgotConfirmation(user, token: string) {
    const url = `${
      APP_CONSTANT.appUrl
    }/auth/reset-password?token=${token}&id=${user._id.toString()}`;
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Reset Password Requested',
      template: './reset', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: user.fullName,
        url,
      },
    });
  }

  async sendInformation(user, information) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Account ${information}`,
      template: `./account`,
      context: {
        name: user.fullName,
        information,
      },
    });
  }

  async sendTransactionConfirm(
    transaction,
    wallet?: {
      balance: number;
      btcDetails: Record<string, any>;
      ethDetails: Record<string, any>;
    },
  ) {
    await this.mailerService.sendMail({
      to: APP_CONSTANT.app_email,
      subject: `Confirm ${transaction.type} Transaction ${transaction._id}`,
      template: `./confirm-transaction`,
      context: {
        rejectLink: `${APP_CONSTANT.appUrl}/decline-transaction/${transaction._id}`,
        acceptLink: `${APP_CONSTANT.appUrl}/confirm-transaction/${transaction._id}`,
        amount: this.formatMoney(transaction.amount),
        type: transaction.type,
        btcAddress: wallet?.btcDetails?.address,
        btcNetwork: wallet?.btcDetails?.network,
        ethNetwork: wallet?.ethDetails?.network,
        ethAddress: wallet?.ethDetails?.address,
      },
    });
  }

  async sendTransactionStatus(user, transaction) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: ` ${transaction.type} Transaction ${transaction.status}`,
      template: `./transaction`,
      context: {
        fullName: user.fullName,
        amount: this.formatMoney(transaction.amount),
        type: transaction.type,
        status: transaction.status,
      },
    });
  }

  async sendChallengeEmail(user, challenge) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Challenge Created ${challenge._id}`,
      template: `./challenge`,
      context: {
        fullName: user.fullName,
        amount: this.formatMoney(challenge.amount),
        // type: transaction.type,
        // status: transaction.status,
      },
    });
  }

  async sendReferralMail(user, data) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: `Referral Bonus Added to your wallet`,
      template: `./referral`,
      context: {
        fullName: user.fullName,
        amount: this.formatMoney(data.amount),
        // type: transaction.type,
        // status: transaction.status,
      },
    });
  }

  formatMoney(amount: number) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  }
}
