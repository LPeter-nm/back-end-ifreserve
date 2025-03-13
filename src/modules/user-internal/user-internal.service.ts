import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CreateUserInternalDto,
  UpdateUserInternalDto,
} from './dto/userInternalDTO';
import { PrismaService } from 'src/database/PrismaService';
import { randomInt } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';

@Injectable()
export class UserInternalService {
  constructor(private readonly prisma: PrismaService) {}

  async register(body: CreateUserInternalDto, req: Request) {
    const typeUser = req.session?.userType;
    if (!typeUser)
      throw new HttpException(
        'É necessário escolher seu tipo de usuário',
        HttpStatus.EXPECTATION_FAILED,
      );
    // Garantindo que só usuários internos possam se registrar
    if (typeUser === 'EXTERNO') {
      throw new HttpException(
        'Rota somente para usuários internos',
        HttpStatus.BAD_REQUEST,
      );
    }
    const registrationCheck = await this.prisma.user_Internal.findFirst({
      where: { registration: body.registration },
    });
    if (registrationCheck)
      throw new HttpException('Matrícula já registrada', HttpStatus.CONFLICT);
    const emailCheck = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }, { name: body.name }],
      },
    });
    if (emailCheck)
      throw new HttpException(
        'Usuário interno já registrado',
        HttpStatus.CONFLICT,
      );
    try {
      const isAluno = /^\d{5}[A-Z]{3}\.[A-Z]{3}\d{4}$/.test(body.registration);
      const isServer = /^\d{4,10}$/.test(body.registration);
      if (!body.email.includes('@'))
        throw new HttpException(
          'O Email está incorreto',
          HttpStatus.BAD_REQUEST,
        );

      if (!isAluno && !isServer) {
        throw new HttpException(
          'A matrícula não corresponde a nenhum tipo de usuário',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      if (
        (typeUser === 'SERVIDOR' && isAluno) ||
        (typeUser === 'ALUNO' && isServer)
      ) {
        throw new HttpException(
          'Matrícula não corresponde ao seu tipo de usuário',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
      const randomPass = randomInt(10, 16);
      const hashedPassword = await bcrypt.hash(body.password, randomPass);
      const registerInt = await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          type_User: typeUser,
          userInternal: {
            create: {
              registration: body.registration,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          status: true,
          userInternal: {
            select: {
              registration: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!isAluno && typeUser === 'SERVIDOR' && isServer) {
        await this.prisma.user.update({
          where: { id: registerInt.id },
          data: {
            role: 'ADMIN',
          },
        });
      } else if (!isAluno && typeUser === 'ALUNO') {
        return {
          message: 'Formato de matrícula incorreto',
          status: HttpStatus.FORBIDDEN,
        };
      }
      return registerInt;
    } catch (error) {
      return {
        message: 'Erro ao registrar usuário interno',
        error: error,
      };
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user_Internal.findMany({
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
              type_User: true,
              role: true,
              status: true,
            },
          },
          registration: true,
        },
      });
      return users;
    } catch (error) {
      return {
        message: 'Erro ao listar usuários internos',
        error: error,
      };
    }
  }

  async findOne(req: Request) {
    try {
      const usrInternal = await this.prisma.user_Internal.findFirst({
        where: {
          userId: req.user?.id,
        },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
              password: true,
              status: true,
            },
          },
          registration: true,
          userId: true,
        },
      });

      return usrInternal;
    } catch (error) {
      return {
        message: 'Erro ao listar usuário interno',
        error: error,
      };
    }
  }

  async update(body: UpdateUserInternalDto, req: Request) {
    const userId = req.user?.id;

    const usrCheck = await this.prisma.user_Internal.findUnique({
      where: { userId },
    });

    if (!usrCheck)
      throw new HttpException(
        'Usuário não encontrado no token fornecido',
        HttpStatus.NOT_FOUND,
      );

    const randomPass = randomInt(10, 16);
    const hashedPassword = await bcrypt.hash(
      body.password as string,
      randomPass,
    );

    try {
      const usrUpdated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: body.name,
          password: hashedPassword,
        },
      });

      return usrUpdated;
    } catch (error) {
      return {
        message: 'Erro ao atualizar usuário interno',
        error: error,
      };
    }
  }

  async delete(req: Request) {
    const userId = req.user?.id;

    const userCheck = await this.prisma.user_Internal.findUnique({
      where: { userId },
    });
    if (!userCheck) {
      throw new HttpException(
        'Usuário não encontrado no token fornecido',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.prisma.user_Internal.delete({
        where: { userId },
      });

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          status: 'INATIVO',
        },
      });

      return {
        message: 'Usuário deletado com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      return {
        message: 'Erro ao deletar usuário interno',
        error: error,
      };
    }
  }
}
