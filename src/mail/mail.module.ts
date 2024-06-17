import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import * as hbs from 'handlebars';

// Define supported comparison operators and their corresponding functions
const operators = {
  '==': (a: any, b: any) => a === b,
  '===': (a: any, b: any) => a === b,
  '!=': (a: any, b: any) => a !== b,
  '!==': (a: any, b: any) => a !== b,
  '<': (a: number, b: number) => a < b,
  '>': (a: number, b: number) => a > b,
  '<=': (a: number, b: number) => a <= b,
  '>=': (a: number, b: number) => a >= b,
};
function compare(lvalue: any, operator: string, rvalue: any, options: any) {
  const supportedOperator = operators[operator];

  // Throw an error if the operator is not supported
  if (!supportedOperator) {
    throw new Error(`Unsupported comparison operator: ${operator}`);
  }

  // Ensure numeric comparison for "<", ">", "<=", ">=" operators
  if (
    ['<', '>', '<=', '>='].includes(operator) &&
    typeof lvalue !== 'number' &&
    typeof rvalue !== 'number'
  ) {
    throw new Error(`Numeric values required for operators: <, >, <=, >=`);
  }

  // Perform the comparison using the supported operator function
  if (supportedOperator(lvalue, rvalue)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
  constructor() {
    this.registerHelpers();
  }

  private registerHelpers() {
    hbs.registerHelper('compare', compare);
  }
}
