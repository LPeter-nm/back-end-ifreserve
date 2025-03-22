import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import * as bcript from 'bcryptjs';
import { PrismaService } from '../../database/PrismaService';
import {
  NewPassword,
  PasswordRedefinition,
  TokenConfirmed,
} from './dto/restoreDto';
import { EmailService } from '../email/email.service';

@Injectable()
export class RestoreService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async createToken(body: PasswordRedefinition) {
    const userCheck = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!userCheck) {
      throw new HttpException(`Usuário inexistente!`, HttpStatus.NOT_FOUND);
    }

    const activeToken = await this.prismaService.restore.findFirst({
      where: {
        userId: userCheck.id,
        expirationAt: { gt: new Date() },
        used: false,
      },
    });

    if (activeToken) {
      throw new HttpException(
        'Já existe um token ativo para este usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const randomToken = String(randomInt(1000, 9999));
    const context = {
      username: userCheck.name,
      code: randomToken,
    };

    await this.emailService.sendEmail(
      userCheck.email,
      'Recuperação de Senha',
      'recovery',
      context,
    );

    const expirationTime = parseInt(
      process.env.TOKEN_EXPIRATION_MINUTES || '20',
      10,
    );
    const expirationAt = new Date(Date.now() + expirationTime * 60 * 1000);

    try {
      const passwordRedefinition = await this.prismaService.restore.create({
        data: {
          token: randomToken,
          expirationAt,
          userId: userCheck.id,
        },
      });

      if (!passwordRedefinition) {
        throw new HttpException(
          `Erro ao criar token de recuperação de usuário!`,
          HttpStatus.EXPECTATION_FAILED,
        );
      }

      return {
        message:
          'Token de redefinição enviado com sucesso! O tempo de expiração dele é de 20 minutos!',
        passwordRedefinition,
      };
    } catch (error) {
      console.error('Erro ao criar token:', error.message, error.stack);
      throw new HttpException(
        'Erro ao criar token de recuperação.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async confirmToken(body: TokenConfirmed) {
    const restore = await this.prismaService.restore.findUnique({
      where: {
        id: body.tokenId,
        used: false,
      },
      select: {
        id: true,
        token: true,
        used: true,
        expirationAt: true,
        user: true,
      },
    });

    if (!restore) {
      throw new HttpException(`Token inexistente!`, HttpStatus.NOT_FOUND);
    }

    if (restore.expirationAt.getTime() < new Date().getTime()) {
      throw new HttpException(`O token está expirado!`, HttpStatus.NOT_FOUND);
    }

    if (restore.used) {
      throw new HttpException(
        `O token já foi utilizado!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (restore.token !== body.token) {
      throw new HttpException(
        `O token enviado não corresponde ao enviado ao email! Tente novamente com outro token de redefinição.`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const tokenConfirmed = await this.prismaService.restore.update({
      where: {
        id: restore.id,
      },
      data: {
        used: true,
      },
    });

    return {
      message: 'O token foi enviado corretamente, agora digite sua nova senha!',
      tokenConfirmed,
    };
  }

  async updatePassword(body: NewPassword) {
    const tokenCheck = await this.prismaService.restore.findUnique({
      where: {
        id: body.tokenId,
      },
    });

    if (!tokenCheck) {
      throw new HttpException(
        `Token inexistente ou o Token não está associado ao usuário especificado!`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (tokenCheck.expirationAt.getTime() < new Date().getTime()) {
      throw new HttpException(`O token está expirado!`, HttpStatus.NOT_FOUND);
    }

    if (tokenCheck.used !== true) {
      throw new HttpException(`Token inválido!`, HttpStatus.UNAUTHORIZED);
    }

    const ramdomSalt = randomInt(10, 16);
    const hashPassword = await bcript.hash(body.password, ramdomSalt);

    const userUpdate = await this.prismaService.user.update({
      where: {
        id: tokenCheck.userId,
      },
      data: {
        password: hashPassword,
      },
    });

    if (!userUpdate) {
      throw new HttpException(
        `Ocorreu um erro ao atualizar a senha do usuário!`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return {
      message: 'Senha atualizada com sucesso!',
    };
  }

  async findAllTokens(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        restores: true,
      },
    });

    if (!user) {
      throw new HttpException(`Usuário inexistente!`, HttpStatus.NOT_FOUND);
    }

    return {
      user,
    };
  }
}
