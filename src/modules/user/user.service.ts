import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';


@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // ficará só para meus testes (lembrar de apagar após termino)
  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        include: {
          reserves: true,
          restores: true,
        },
      });

      return users;
    } catch (error) {
      throw new HttpException(error as string, HttpStatus.BAD_REQUEST);
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
      throw new HttpException(error as string, HttpStatus.BAD_REQUEST);
    }
  }

  async delete(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user)
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);

      if (user.role === 'GENERAL')
        throw new ForbiddenException(
          'Não é permitido excluir o administrador geral',
        );

      await prisma.user.delete({ where: { id } });

      return {
        message: 'Usuário deletado com sucesso',
        status: HttpStatus.OK,
      };
    });
  }
}
