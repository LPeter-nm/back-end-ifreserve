import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/authDTO';
import { Public } from './skipAuth/skipAuth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async create(@Body() body: CreateAuthDto) {
    return await this.authService.singIn(body.email, body.password);
  }
}
