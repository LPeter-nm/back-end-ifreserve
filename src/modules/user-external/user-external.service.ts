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

@Injectable()
export class UserExternalService {
  constructor(private readonly prisma: PrismaService) {}

  async registerExternal(body: CreateUserExternalDto, req: Request) {
    const typeUser = req.session.userType;

    const cpfRegistered = await this.prisma.user_External.findUnique({
      where: { cpf: body.cpf },
    });
    if (cpfRegistered)
      throw new HttpException(
        'CPF já cadastrado no sistema',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const randomPass = randomInt(10, 16);
      const hashedPassword = await bcrypt.hash(body.password, randomPass);

      if (!body.email.includes('@'))
        throw new HttpException(
          'O Email está incorreto',
          HttpStatus.BAD_REQUEST,
        );

      if (typeUser === 'ALUNO' || typeUser === 'SERVIDOR') {
        // Garantindo que só usuários externos possam se registrar
        throw new HttpException(
          'Rota somente para usuários externos ao Intituto',
          HttpStatus.BAD_REQUEST,
        );
      }
      const registerUser = await this.prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashedPassword,
          type_User: typeUser,
        },
      });

      const registerUserEsp = await this.prisma.user_External.create({
        data: {
          cpf: body.cpf,
          phone: body.phone,
          address: body.address,
          userId: registerUser.id,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
            },
          },
          cpf: true,
          phone: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return registerUserEsp;
    } catch (error) {
      throw new HttpException(error as string, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user_External.findMany({
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          cpf: true,
          phone: true,
          address: true,
        },
      });

      return users;
    } catch (error) {
      throw new HttpException(error as string, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(req: Request) {
    try {
      const usrExternal = await this.prisma.user_External.findFirst({
        where: { userId: req.user?.id },
        select: {
          user: {
            select: {
              name: true,
              email: true,
              password: true,
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
    } catch (error) {
      throw new HttpException(error as string, HttpStatus.BAD_REQUEST);
    }
  }

  async update(req: Request, body: UpdateUserExternalDto) {
    const userId = req.user?.id;

    const usr = await this.prisma.user_External.findUnique({
      where: { userId: userId },
    });
    if (!usr)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

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
    } catch (error) {
      throw new HttpException(error as string, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(req: Request) {
    const userId = req.user?.id;

    const userCheck = await this.prisma.user_External.findUnique({
      where: { userId: userId },
    });
    if (!userCheck) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      await this.prisma.user_External.delete({ where: { userId: userId } });

      return {
        message: 'Usuário deletado com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    } catch (error) {
      throw new HttpException(error as string, HttpStatus.BAD_REQUEST);
    }
  }
}
