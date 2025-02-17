import { Module } from '@nestjs/common';
import { UserInternalService } from './user-internal.service';
import { UserInternalController } from './user-internal.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [UserInternalController],
  providers: [UserInternalService, PrismaService],
})
export class UserInternalModule {}
