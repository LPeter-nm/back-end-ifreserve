import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { CaslModule } from '../casl/casl.module';
import * as nodemailer from 'nodemailer';

@Module({
  imports: [CaslModule],
  providers: [
    EmailService,
    {
      provide: 'MAIL_TRANSPORT',
      useFactory: () => {
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
      },
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
