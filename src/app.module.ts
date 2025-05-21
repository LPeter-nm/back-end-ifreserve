import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { CaslModule } from './modules/casl/casl.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './database/PrismaService';
import { UserExternalModule } from './modules/user-external/user-external.module';
import { ReserveSportModule } from './modules/reserve-sport/reserve-sport.module';
import { ReserveModule } from './modules/reserve/reserve.module';
import { ReserveClassroomModule } from './modules/reserve-classroom/reserve-classroom.module';
import { ReserveEventModule } from './modules/reserve-event/reserve-event.module';
import { EmailModule } from './modules/email/email.module';
import { RestoreModule } from './modules/restore/restore.module';
import { ReportModule } from './modules/report/report.module';
import { NotificationModule } from './modules/notification/notification.module';
import { StudentModule } from './modules/student/student.module';
import { ServerModule } from './modules/server/server.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
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
    StudentModule,
    ServerModule,
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
export class AppModule {}
