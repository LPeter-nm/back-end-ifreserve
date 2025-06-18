import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/authDTO';
import { Public } from './skipAuth/skipAuth';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, request, Response } from 'express';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwt: JwtService,
    private readonly authService: AuthService,
    private readonly usr: UserService,
  ) {}

  @Public()
  @Post('login')
  @ApiResponse({ status: 400, description: 'Credenciais inválidas' })
  @ApiResponse({ status: 404, description: 'Email não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  async logIn(@Body() body: CreateAuthDto, @Req() req: Request) {
    const ip = req.ip as string;
    return await this.authService.singIn(body.email, body.password, ip);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      const googleUser = req.user as any;

      const existingUser = await this.usr.findOne(googleUser.user.email);
      if (existingUser) {
        const completeUser = this.checkUserCompletion(existingUser);
        console.log(completeUser);
        if (completeUser === false) {
          const payload = {
            id: existingUser.user?.id,
            email: existingUser.user?.email,
            role: existingUser.user?.role,
          };

          const token = await this.jwt.signAsync(payload);

          return res.redirect(`http://localhost:3000/home?token=${token}`);
        }
      }

      if (existingUser.user?.typeUser === 'ALUNO') {
        return res.redirect(
          `http://localhost:3000/complete-student?userId=${existingUser.user.id}&email=${googleUser.user.email}&name=${googleUser.user.name}`,
        );
      } else if (existingUser.user?.typeUser === 'SERVIDOR') {
        return res.redirect(
          `http://localhost:3000/complete-server?userId=${existingUser.user.id}&email=${googleUser.user.email}&name=${googleUser.user.name}`,
        );
      } else {
        return res.redirect(
          `http://localhost:3000/complete-external?userId=${existingUser.user?.id}&email=${googleUser.user.email}&name=${googleUser.user.name}`,
        );
      }
    } catch (error) {
      console.error(error);
      return res.redirect(
        `http://localhost:3000/login-error?message=${error.message}`,
      );
    }
  }

  private checkUserCompletion(user: any): boolean {
    const { typeUser, identification } = user.user;

    switch (typeUser) {
      case 'ALUNO':
        return /^\d{4}[12]EXP.TMN\d{4}$/.test(identification);

      case 'SERVIDOR':
        return /^\d{6}$/.test(identification);

      case 'EXTERNO':
        return identification === '';

      default:
        return false;
    }
  }
}
