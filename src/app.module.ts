import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [],
})
export class AppModule {}
