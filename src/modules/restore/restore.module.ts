import { Module } from '@nestjs/common';
import { RestoreService } from './restore.service';
import { RestoreController } from './restore.controller';
import { PrismaService } from '../../database/PrismaService';
import { CaslModule } from '../casl/casl.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [CaslModule, EmailModule],
  providers: [RestoreService, PrismaService],
  controllers: [RestoreController],
})
export class RestoreModule {}
