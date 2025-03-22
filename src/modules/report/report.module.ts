import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [ReportController],
  providers: [ReportService, PrismaService],
})
export class ReportModule {}
