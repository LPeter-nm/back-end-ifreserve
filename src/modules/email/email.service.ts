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
  private templates: Record<string, HandlebarsTemplateDelegate> = {};

  constructor(
    @Inject('MAIL_TRANSPORT') private transporter: nodemailer.Transporter,
  ) {}

  private async compileTemplate(
    templateName: string,
    context: context,
  ): Promise<string> {
    if (!this.templates[templateName]) {
      const templatePath = path.join(
        __dirname,
        '../../../src/templates',
        `${templateName}.hbs`,
      );
      if (!fs.existsSync(templatePath)) {
        throw new Error(`Template ${templateName} não encontrado.`);
      }
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      this.templates[templateName] = handlebars.compile(templateSource);
    }
    return this.templates[templateName](context);
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
      console.log(`E-mail enviado para ${to}`);
      return info;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error.message, error.stack);
      throw new Error('Falha ao enviar e-mail.');
    }
  }
}
