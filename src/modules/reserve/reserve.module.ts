import { Module } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [CaslModule],
  controllers: [ReserveController],
  providers: [ReserveService, PrismaService, NotificationService],
})
export class ReserveModule {}
