import { Module } from '@nestjs/common';
import { ReserveSportService } from './reserve-sport.service';
import { ReserveSportController } from './reserve-sport.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [CaslModule],
  controllers: [ReserveSportController],
  providers: [ReserveSportService, PrismaService, NotificationService],
})
export class ReserveSportModule {}
