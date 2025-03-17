import { Module } from '@nestjs/common';
import { ReserveClassroomService } from './reserve-classroom.service';
import { ReserveClassroomController } from './reserve-classroom.controller';

@Module({
  controllers: [ReserveClassroomController],
  providers: [ReserveClassroomService],
})
export class ReserveClassroomModule {}
