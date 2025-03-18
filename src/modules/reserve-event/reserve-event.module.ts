import { Module } from '@nestjs/common';
import { ReserveEventService } from './reserve-event.service';
import { ReserveEventController } from './reserve-event.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [ReserveEventController],
  providers: [ReserveEventService, PrismaService],
})
export class ReserveEventModule {}
