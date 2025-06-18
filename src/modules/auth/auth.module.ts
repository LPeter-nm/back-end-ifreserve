import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/PrismaService';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CaslModule } from '../casl/casl.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import googleOauthConfig from './config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { UserExternalService } from '../user-external/user-external.service';
import { StudentService } from '../student/student.service';
import { ServerService } from '../server/server.service';

@Module({
  imports: [
    UserModule,
    CaslModule,
    ConfigModule.forFeature(googleOauthConfig),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '1h',
      },
    }),
    ThrottlerModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    AuthService,
    UserService,
    PrismaService,
    UserExternalService,
    StudentService,
    ServerService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AuthModule {}
