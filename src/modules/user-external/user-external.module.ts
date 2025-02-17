import { Module } from '@nestjs/common';
import { UserExternalService } from './user-external.service';
import { UserExternalController } from './user-external.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [UserExternalController],
  providers: [UserExternalService, PrismaService],
})
export class UserExternalModule {}
