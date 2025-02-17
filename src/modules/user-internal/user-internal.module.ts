import { Module } from '@nestjs/common';
import { UserInternalService } from './user-internal.service';
import { UserInternalController } from './user-internal.controller';
import { PrismaService } from 'src/database/PrismaService';
import { CaslModule } from '../casl/casl.module';
import { UserTypeMiddleware } from '../user/middleware/type-user';

@Module({
  imports: [CaslModule],
  controllers: [UserInternalController],
  providers: [UserInternalService, PrismaService, UserTypeMiddleware],
})
export class UserInternalModule {}
