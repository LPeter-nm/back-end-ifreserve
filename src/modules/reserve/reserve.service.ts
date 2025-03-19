import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { handleAsyncOperation } from 'src/validations/prismaValidate';

@Injectable()
export class ReserveService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return handleAsyncOperation(async () => {
      const reserves = await this.prisma.reserve.findMany({
        include: {
          sport: true,
          classroom: true,
          event: true,
        },
      });

      return reserves;
    });
  }

  findOne(id: string) {
    return handleAsyncOperation(async () => {
      const reserve = await this.prisma.reserve.findUnique({
        where: { id },
        include: {
          sport: true,
          classroom: true,
          event: true,
        },
      });

      if (!reserve) {
        throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
      }

      return reserve;
    });
  }
}
