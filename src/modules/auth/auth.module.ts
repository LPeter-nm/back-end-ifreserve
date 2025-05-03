import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/PrismaService';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CaslModule } from '../casl/casl.module';

@Module({
  imports: [
    UserModule,
    CaslModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService],
})
export class AuthModule {}
