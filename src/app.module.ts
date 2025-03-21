import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { CaslModule } from './modules/casl/casl.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserInternalModule } from './modules/user-internal/user-internal.module';
import { PrismaService } from './database/PrismaService';
import { UserTypeMiddleware } from './modules/user/middleware/type-user';
import { UserController } from './modules/user/user.controller';
import { UserExternalModule } from './modules/user-external/user-external.module';
import { ReserveSportModule } from './modules/reserve-sport/reserve-sport.module';
import { ReserveModule } from './modules/reserve/reserve.module';
import { ReserveClassroomModule } from './modules/reserve-classroom/reserve-classroom.module';
import { ReserveEventModule } from './modules/reserve-event/reserve-event.module';
import { EmailModule } from './modules/email/email.module';
import { RestoreModule } from './modules/restore/restore.module';
import { ReportModule } from './modules/report/report.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    UserInternalModule,
    UserExternalModule,
    CaslModule,
    AuthModule,
    ReserveSportModule,
    ReserveModule,
    ReserveClassroomModule,
    ReserveEventModule,
    EmailModule,
    RestoreModule,
    ReportModule,
    NotificationModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    PrismaService,
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserTypeMiddleware).forRoutes(UserController);
  }
}
