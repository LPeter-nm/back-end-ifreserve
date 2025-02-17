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
      const randomPass = randomInt(10, 16);
      const hashedPassword = await bcrypt.hash(body.password, randomPass);
      const user = await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          type_User: req.session?.userType,
        },
      });
      const registerUser = await this.prisma.user_Internal.create({
        data: {
          userId: user.id,
          registration: body.registration,
        },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
              password: true,
            },
          },
          registration: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!isAluno && typeUser === 'SERVIDOR' && isServer) {
        await this.prisma.user.update({
          where: { id: user.id },
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
      return {
        usr: registerUser,
      };
    } catch (error) {
      return {
        message: 'Erro ao registrar usuário interno',
        error: error,
      };
    }
  }

  async findAll(req: Request) {
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
          id: req.user?.id,
        },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
              password: true,
            },
          },
          registration: true,
          userId: true,
        },
      });

      const usr = await this.prisma.user.findUnique({
        where: { id: usrInternal?.userId },
      });

      if (usr?.id !== req.user?.id)
        throw new ForbiddenException(
          'Você só pode acessar seus dados | deixe de ser curioso',
        );

      return usrInternal;
    } catch (error) {
      return {
        message: 'Erro ao listar usuário interno',
        error: error,
      };
    }
  }

  async update(body: UpdateUserInternalDto, req: Request) {
    const usrCheck = await this.prisma.user_Internal.findUnique({
      where: { id: req.user?.id },
    });

    if (!usrCheck)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    if (usrCheck?.id !== req.user?.id)
      throw new ForbiddenException(
        'Você só pode atualizar seus dados | deixe de ser hacker periculoso',
      );

    const randomPass = randomInt(10, 16);
    const hashedPassword = await bcrypt.hash(
      body.password as string,
      randomPass,
    );

    try {
      const usrUpdated = await this.prisma.user.update({
        where: { id: req.user?.id },
        data: {
          ...body,
          password: hashedPassword,
        },
      });

      if (!usrUpdated)
        throw new HttpException(
          'Erro ao atualizar dados do usuário',
          HttpStatus.BAD_REQUEST,
        );

      return usrUpdated;
    } catch (error) {
      return {
        message: 'Erro ao atualizar usuário interno',
        error: error,
      };
    }
  }

  async delete(req: Request) {
    const userCheck = await this.prisma.user_Internal.findUnique({
      where: { id: req.user?.id },
    });
    if (!userCheck) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    if (userCheck?.id !== req.user?.id)
      throw new ForbiddenException(
        'Você só pode excluir seus dados | deixe de ser malandro',
      );

    try {
      await this.prisma.user_Internal.delete({ where: { id: req.user?.id } });

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
