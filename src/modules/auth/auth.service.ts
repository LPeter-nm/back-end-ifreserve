import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import {
  ThrottlerException,
  ThrottlerGuard,
  Throttle,
  ThrottlerModule,
} from '@nestjs/throttler';

@Injectable()
export class AuthService {
  // Contador de tentativas falhas por IP
  private loginAttempts: Map<
    string,
    { attempts: number; lastAttempt: number }
  > = new Map();

  // Configurações do rate limiting
  private readonly MAX_ATTEMPTS = 5; // Máximo de tentativas
  private readonly ATTEMPT_WINDOW = 15 * 60 * 1000; // Janela de 15 minutos em milissegundos
  private readonly LOCKOUT_TIME = 15 * 60 * 1000; // Tempo de bloqueio de 30 minutos

  constructor(
    private readonly usr: UserService,
    private readonly jwt: JwtService,
  ) {}

  private checkLoginAttempts(ip: string): void {
    const now = Date.now();
    const attemptData = this.loginAttempts.get(ip) || {
      attempts: 0,
      lastAttempt: 0,
    };

    // Se o último attempt foi há mais tempo que a janela, resetar o contador
    if (now - attemptData.lastAttempt > this.ATTEMPT_WINDOW) {
      this.loginAttempts.set(ip, { attempts: 1, lastAttempt: now });
      return;
    }

    // Verificar se excedeu o número máximo de tentativas
    if (attemptData.attempts >= this.MAX_ATTEMPTS) {
      const timeSinceLastAttempt = now - attemptData.lastAttempt;
      const remainingTime = Math.ceil(
        (this.LOCKOUT_TIME - timeSinceLastAttempt) / 1000 / 60,
      );

      throw new ThrottlerException(
        `Muitas tentativas de login. Tente novamente em ${remainingTime} minutos.`,
      );
    }

    // Incrementar contador de tentativas
    this.loginAttempts.set(ip, {
      attempts: attemptData.attempts + 1,
      lastAttempt: now,
    });
  }

  private resetLoginAttempts(ip: string): void {
    this.loginAttempts.delete(ip);
  }

  async singIn(
    email: string,
    password: string,
    ip: string, // Adicionado parâmetro IP para rastreamento
  ): Promise<{ access_token: string }> {
    try {
      // Verificar tentativas de login antes de processar
      this.checkLoginAttempts(ip);

      const user = await this.usr.findOne(email);

      if (!user) {
        throw new HttpException('Credenciais inválidas', HttpStatus.NOT_FOUND);
      }

      const payload = {
        id: user.user?.id,
        role: user.user?.role,
      };

      const passwordCheck = await bcrypt.compare(
        password,
        user.user?.password as string,
      );

      if (!passwordCheck) {
        throw new BadRequestException({
          message: 'Credenciais inválidas',
          error: 'Credenciais inválidas',
        });
      }

      // Resetar contador se o login for bem-sucedido
      this.resetLoginAttempts(ip);

      return {
        access_token: await this.jwt.signAsync(payload),
      };
    } catch (error) {
      // Incrementar contador apenas para erros de credenciais
      if (
        error instanceof HttpException &&
        (error.getStatus() === HttpStatus.NOT_FOUND ||
          error instanceof BadRequestException)
      ) {
        const attemptData = this.loginAttempts.get(ip) || {
          attempts: 0,
          lastAttempt: 0,
        };
        this.loginAttempts.set(ip, {
          attempts: attemptData.attempts + 1,
          lastAttempt: Date.now(),
        });
      }

      throw new HttpException(error.message as string, HttpStatus.BAD_REQUEST);
    }
  }
}
