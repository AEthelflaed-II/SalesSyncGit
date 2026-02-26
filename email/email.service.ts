import { Injectable, Logger } from '@nestjs/common';
import { ApplicationError } from '@/common/errors/application.error';
import { ConfigService } from '@/config/config.service';
import { AmazonSESService } from '../integration/amazon/services/amazon-ses.service';
import * as ejs from 'ejs';
import * as path from 'path';

export type EmailTemplate =
  | 'signup'
  | 'reset-password'
  | 'payments/pending'
  | 'payments/paid'
  | 'payments/refused'
  | 'payments/expired'
  | 'payments/canceled'
  | 'payments/released'
  | 'payments/reversed';

export interface ISendEmailOptions {
  from?: string;
  to: string[];
  subject: string;
}

export interface SendEmailSignUp extends ISendEmailOptions {
  template: 'signup';
  data: {
    cdnUrl: string;
    name: string;
    document: string;
    password: string;
    href: string;
  };
}

export interface SendEmailResetPassword extends ISendEmailOptions {
  template: 'reset-password';
  data: {
    name: string;
    href: string;
  };
}

export interface SendEmailPaymentStatus extends ISendEmailOptions {
  template:
    | 'payments/pending'
    | 'payments/paid'
    | 'payments/refused'
    | 'payments/expired'
    | 'payments/canceled'
    | 'payments/released'
    | 'payments/reversed';
  data: {
    cdnUrl: string;
    status: string;
    name: string;
    invoice: string;
    whatsAppNumber: string;
  };
}

export type SendEmailOptions =
  | SendEmailSignUp
  | SendEmailResetPassword
  | SendEmailPaymentStatus;

@Injectable()
export class EmailService {
  private readonly logger: Logger = new Logger(EmailService.name);
  constructor(
    private readonly config: ConfigService,
    private readonly amazonSES: AmazonSESService,
  ) {}
  async sendEmail({ from, to, subject, template, data }: SendEmailOptions) {
    const html = await this.getTemplate(template, data);
    return this.amazonSES.sendEmail({
      from: from || `Entourage Phytolab <${this.config.AWS_SES_EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
  }

  private async getTemplate<T = SendEmailOptions>(template: EmailTemplate, data: T) {
    try {
      const html = await ejs.renderFile(
        path.resolve(`./assets/email/templates/${template}.ejs`),
        data,
        {
          async: true,
        },
      );

      return html;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof Error && 'code' in error) {
        if (error.code === 'ENOENT') {
          throw new ApplicationError({
            module: 'Email',
            code: 'S.EML.1',
            message: 'Template de email informado não existe.',
            errors: [error],
          });
        }

        throw new ApplicationError({
          module: 'Email',
          code: 'S.EML.2',
          message: 'Erro ao renderizar template de email.',
          errors: [error],
        });
      }

      throw error;
    }
  }
}
