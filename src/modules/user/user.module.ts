import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [CaslModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
