import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServerDto, UpdateServerDto } from './dto/serverDto';
import { PrismaService } from 'src/database/PrismaService';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { validateUser } from 'src/validations/authValidate';

@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateServerDto) {
    if (!body.function_Server) {
      throw new HttpException(
        'Digite sua função',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const upperFunctionServer = body.function_Server.toUpperCase();

    const userRegistered = await this.prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [{ identification: body.registration }, { email: body.email }],
          },
        ],
      },
    });

    if (userRegistered) {
      throw new HttpException(
        'Usuário já cadastrado no sistema',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.password.length < 8) {
      throw new HttpException(
        'É necessário que sua senha tenha pelo menos 8 caracteres',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    if (body.registration.length < 6 || body.registration.length > 8) {
      throw new HttpException(
        'É necessário que sua mátricula tenha entre 6 e 8 caracteres',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return handleAsyncOperation(async () => {
      const randomPass = randomInt(10, 16);
      const hashedPassword = await bcrypt.hash(body.password, randomPass);

      if (!body.email.includes('@acad.ifma.edu.br')) {
        throw new HttpException(
          'O Email está incorreto',
          HttpStatus.BAD_REQUEST,
        );
      }

      const registerServer = await this.prisma.user.create({
        data: {
          name: body.name,
          identification: body.registration,
          email: body.email,
          password: hashedPassword,
          type_User: 'SERVIDOR',
          server: {
            create: {
              funtion_Server: upperFunctionServer,
            },
          },
        },
        include: {
          server: true,
        },
      });

      if (
        registerServer.type_User == 'SERVIDOR' &&
        registerServer.server?.funtion_Server == 'PROFESSOR DE EDUCAÇÃO FÍSICA'
      ) {
        await this.prisma.user.update({
          where: { id: registerServer.id },
          data: {
            role: 'ADMIN',
          },
        });
      }

      return registerServer;
    });
  }

  findAll() {
    return handleAsyncOperation(async () => {
      const servers = await this.prisma.server.findMany({
        select: {
          user: {
            select: {
              name: true,
              email: true,
              identification: true,
              status: true,
            },
          },
          funtion_Server: true,
        },
      });

      return servers;
    });
  }

  async findOne(req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    return handleAsyncOperation(async () => {
      const server = await this.prisma.user.findFirst({
        select: {
          name: true,
          email: true,
          identification: true,
          status: true,
          server: {
            select: {
              funtion_Server: true,
            },
          },
        },
      });

      if (!server) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      return server;
    });
  }

  async update(body: UpdateServerDto, req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    const upperFunctionServer = body.function_Server;

    const randomPass = randomInt(10, 16);
    const hashedPassword = await bcrypt.hash(
      body.password as string,
      randomPass,
    );

    return handleAsyncOperation(async () => {
      const serverUpdated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: body.name,
          password: hashedPassword,
          server: {
            update: {
              funtion_Server: upperFunctionServer,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          identification: true,
          server: {
            select: {
              funtion_Server: true,
            },
          },
        },
      });

      return serverUpdated;
    });
  }

  remove(req: Request) {
    return this.prisma.$transaction(async (prisma) => {
      const userId = req.user?.id as string;

      await validateUser(userId);

      await prisma.user.update({
        where: { id: userId },
        data: {
          status: 'INATIVO',
          server: {
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
