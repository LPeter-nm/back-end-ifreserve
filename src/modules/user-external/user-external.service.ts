import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CompleteExternalDto,
  CreateUserExternalDto,
  UpdateUserExternalDto,
} from './dto/userExternalDTO';
import { PrismaService } from 'src/database/PrismaService';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { Request } from 'express';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { validateUser } from 'src/validations/authValidate';
import { PaginationDto } from 'src/common/dto/paginationDto';

@Injectable()
export class UserExternalService {
  constructor(private readonly prisma: PrismaService) {}

  async registerExternal(body: CreateUserExternalDto) {
    const identificationRegistered = await this.prisma.user.findUnique({
      where: { identification: body.identification },
    });
    if (identificationRegistered)
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

      const registerExternal = await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          identification: body.identification,
          password: hashedPassword,
          typeUser: 'EXTERNO',
          userExternal: {
            create: {
              phone: body.phone,
              address: body.address,
            },
          },
        },
        select: {
          id: true,
          name: true,
          identification: true,
          email: true,
          password: true,
          status: true,
          userExternal: {
            select: {
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

  async completeExternal(
    userId: string,
    body: CompleteExternalDto,
    query: { email: string },
  ) {
    const identificationRegistered = await this.prisma.user.findUnique({
      where: { identification: body.identification },
    });
    if (identificationRegistered)
      throw new HttpException(
        'CPF já cadastrado no sistema',
        HttpStatus.CONFLICT,
      );

    const findUser = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!findUser) {
      throw new HttpException(
        'Registro temporário não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    if (body.password.length < 8) {
      throw new HttpException(
        'É necessário que a senha tenha pelo menos 8 caracteres',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return handleAsyncOperation(async () => {
      const randomPass = randomInt(10, 16);
      const hashedPassword = await bcrypt.hash(body.password, randomPass);

      if (!query.email.includes('@'))
        throw new HttpException(
          'O Email está incorreto',
          HttpStatus.BAD_REQUEST,
        );

      const registerExternal = await this.prisma.user.update({
        where: { id: userId },
        data: {
          identification: body.identification,
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
          identification: true,
          email: true,
          password: true,
          status: true,
          userExternal: {
            select: {
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

  async findAll(paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const offSet = (page - 1) * pageSize;

    return handleAsyncOperation(async () => {
      const users = await this.prisma.userExternal.findMany({
        skip: offSet,
        take: Number(pageSize),
        orderBy: { id: 'desc' },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              identification: true,
              email: true,
              status: true,
              role: true,
            },
          },
          phone: true,
          address: true,
        },
      });

      const totalExternal = await this.prisma.userExternal.count();

      return {
        data: users,
        totaPages: Math.ceil(totalExternal / pageSize),
        currentPage: page,
      };
    });
  }

  async findOne(req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    return handleAsyncOperation(async () => {
      const usrExternal = await this.prisma.userExternal.findFirst({
        where: { userId },
        select: {
          id: true,
          user: {
            select: {
              name: true,
              email: true,
              identification: true,
              password: true,
              status: true,
            },
          },
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
