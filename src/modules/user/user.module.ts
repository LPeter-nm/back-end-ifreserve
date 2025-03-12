import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';
import { UserTypeMiddleware } from './middleware/type-user';

@Module({
  imports: [CaslModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, UserTypeMiddleware],
})
export class UserModule {}
