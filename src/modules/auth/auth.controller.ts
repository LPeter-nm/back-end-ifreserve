import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/authDTO';
import { Public } from './skipAuth/skipAuth';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiResponse({ status: 400, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 404, description: 'Email não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async create(@Body() body: CreateAuthDto) {
    return await this.authService.singIn(body.email, body.password);
  }
}
