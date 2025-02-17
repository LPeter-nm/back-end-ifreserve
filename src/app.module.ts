import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { CaslModule } from './modules/casl/casl.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserInternalModule } from './modules/user-internal/user-internal.module';
import { UserService } from './modules/user/user.service';
import { PrismaService } from './database/PrismaService';
import { UserTypeMiddleware } from './modules/user/middleware/type-user';
import { UserController } from './modules/user/user.controller';
import { UserInternalController } from './modules/user-internal/user-internal.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UserModule,
    UserInternalModule,
    CaslModule,
    AuthModule,
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
