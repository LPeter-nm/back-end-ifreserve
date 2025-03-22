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
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
          throw new Error(
            'Variáveis de ambiente EMAIL_USER e EMAIL_PASS são obrigatórias.',
          );
        }
        return nodemailer.createTransport({
          host: 'smtp.gmail.com', // Servidor SMTP do Gmail
          port: 587, // Porta para TLS
          secure: false, // true para porta 465 (SSL)
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
