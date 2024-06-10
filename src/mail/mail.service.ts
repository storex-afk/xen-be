import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user, token: string) {
    const url = `${
      process.env.appUrl
    }/auth/confirm-account?token=${token}&id=${user._id.toString()}`;
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
  }

  async resendConfirmation(user, token: string) {
    const url = `${
      process.env.appUrl
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
      process.env.appUrl
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
}
