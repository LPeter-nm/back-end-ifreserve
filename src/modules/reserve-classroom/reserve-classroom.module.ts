import { Module } from '@nestjs/common';
import { ReserveClassroomService } from './reserve-classroom.service';
import { ReserveClassroomController } from './reserve-classroom.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [CaslModule],
  controllers: [ReserveClassroomController],
  providers: [ReserveClassroomService, PrismaService, NotificationService],
})
export class ReserveClassroomModule {}
