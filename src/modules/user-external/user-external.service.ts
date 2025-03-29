import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CreateUserExternalDto,
  UpdateUserExternalDto,
} from './dto/userExternalDTO';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { Request } from 'express';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { validateUser } from 'src/validations/authValidate';

@Injectable()
export class UserExternalService {
  constructor(private readonly prisma: PrismaService) {}

  async registerExternal(body: CreateUserExternalDto, req: Request) {
    const typeUser = req.session.userType;
    if (!typeUser)
      throw new HttpException(
        'É necessário escolher seu tipo de usuário',
        HttpStatus.EXPECTATION_FAILED,
      );

    const cpfRegistered = await this.prisma.user_External.findUnique({
      where: { cpf: body.cpf },
    });
    if (cpfRegistered)
      throw new HttpException(
        'CPF já cadastrado no sistema',
        HttpStatus.CONFLICT,
      );

    if (body.password.length < 8) {
      throw new HttpException(
        'É necessário que a senha tenha pelo menos 8 caracteres',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return handleAsyncOperation(async () => {
      const randomPass = randomInt(10, 16);
      const hashedPassword = await bcrypt.hash(body.password, randomPass);

      if (!body.email.includes('@'))
        throw new HttpException(
          'O Email está incorreto',
          HttpStatus.BAD_REQUEST,
        );

      if (typeUser === 'ALUNO' || typeUser === 'SERVIDOR') {
        throw new HttpException(
          'Rota somente para usuários externos ao Intituto',
          HttpStatus.FORBIDDEN,
        );
      }
      const registerExternal = await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          type_User: typeUser,
          userExternal: {
            create: {
              cpf: body.cpf,
              phone: body.phone,
              address: body.address,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          status: true,
          userExternal: {
            select: {
              cpf: true,
              phone: true,
              address: true,
            },
          },
          createdAt: true,
        },
      });

      return registerExternal;
    });
  }

  async findAll() {
    return handleAsyncOperation(async () => {
      const users = await this.prisma.user_External.findMany({
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              status: true,
              role: true,
            },
          },
          cpf: true,
          phone: true,
          address: true,
        },
      });

      return users;
    });
  }

  async findOne(req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    return handleAsyncOperation(async () => {
      const usrExternal = await this.prisma.user_External.findFirst({
        where: { userId },
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
          cpf: true,
          phone: true,
          address: true,
          userId: true,
        },
      });

      if (!usrExternal)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

      return usrExternal;
    });
  }

  async update(req: Request, body: UpdateUserExternalDto) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    const randomPass = randomInt(10, 16);
    const hashedPassword = await bcrypt.hash(
      body.password as string,
      randomPass,
    );

    return handleAsyncOperation(async () => {
      const usrUpdated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: body.name,
          password: hashedPassword,
          userExternal: {
            update: {
              phone: body.phone,
              address: body.address,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          userExternal: {
            select: {
              phone: true,
              address: true,
            },
          },
        },
      });

      return usrUpdated;
    });
  }

  async delete(req: Request) {
    return this.prisma.$transaction(async (prisma) => {
      const userId = req.user?.id as string;

      await validateUser(userId);

      await prisma.user.update({
        where: { id: userId },
        data: {
          status: 'INATIVO',
          userExternal: {
            delete: {
              userId,
            },
          },
        },
      });
      return {
        message: 'Usuário deletado com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    });
  }
}
