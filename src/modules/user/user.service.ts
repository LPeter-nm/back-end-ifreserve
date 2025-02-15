import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/userDto';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async choosingUserType(body: CreateUserDto) {
    try {
      const usr = await this.prisma.user.create({
        data: {
          name: '',
          email: '',
          password: '',
          role: 'USER',
          type_User: body.type_User,
        },
        select: {
          id: true,
          role: true,
          type_User: true,
        },
      });

      return usr;
    } catch (error) {
      return {
        message: 'Erro ao criar usuário',
        error: error,
      };
    }
  }

  // ficará só para meus testes (lembrar de apagar após termino)
  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          role: true,
          type_User: true,
        },
      });

      return users;
    } catch (error) {
      return {
        message: 'Erro ao listar usuários',
        error: error,
      };
    }
  }

  // função para ser importada em login do usuário
  async findOne(email: string) {
    try {
      const usrCheck = await this.prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
        },
      });

      if (!usrCheck) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      return {
        user: usrCheck,
      };
    } catch (error) {
      return {
        message: 'Erro ao listar dados do usuário',
        error: error,
      };
    }
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user)
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

    if (user.role === 'GENERAL')
      throw new ForbiddenException(
        'Não é permitido excluir o administrador geral',
      );

    try {
      await this.prisma.user.delete({ where: { id } });

      return {
        message: 'Usuário deletado com sucesso',
        status: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Erro ao deletar usuário',
        status: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
