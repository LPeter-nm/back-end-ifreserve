import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

type context = {
  username: string;
  code: string;
};

@Injectable()
export class EmailService {
  constructor(
    @Inject('MAIL_TRANSPORT') private transporter: nodemailer.Transporter,
  ) {}

  private async compileTemplate(
    templateName: string,
    context: context,
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '../../../src/templates',
      `${templateName}.hbs`,
    );
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(templateSource);
    return compiledTemplate(context);
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ): Promise<any> {
    const htmlContent = await this.compileTemplate(template, context);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }
}
