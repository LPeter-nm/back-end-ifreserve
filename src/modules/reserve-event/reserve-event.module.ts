import { Module } from '@nestjs/common';
import { ReserveEventService } from './reserve-event.service';
import { ReserveEventController } from './reserve-event.controller';

@Module({
  controllers: [ReserveEventController],
  providers: [ReserveEventService],
})
export class ReserveEventModule {}
