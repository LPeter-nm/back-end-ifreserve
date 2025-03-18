import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReserveEventDto, UpdateReserveEventDto } from './dto/eventDto';
import { Request } from 'express';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { PrismaService } from 'src/database/PrismaService';
import { checkConflictingReserves } from 'src/validations/datetimeValidate';
import { validateUser } from 'src/validations/authValidate';

@Injectable()
export class ReserveEventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateReserveEventDto, req: Request) {
    const userId = req.user?.id;
    const userCheck = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!userCheck) {
      throw new HttpException(
        'Usuário necessita estar autenticado para cadastrar reserva',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const dateStart = new Date(body.date_Start);
    const dateEnd = new Date(body.date_End);

    await checkConflictingReserves(
      dateStart,
      dateEnd,
      body.hour_Start,
      body.hour_End,
    );

    return handleAsyncOperation(async () => {
      const reserve = await this.prisma.reserve.create({
        data: {
          type_Reserve: 'EVENTO',
          ocurrence: body.ocurrence,
          date_Start: dateStart,
          date_End: dateEnd,
          hour_Start: body.hour_Start,
          hour_End: body.hour_End,
          userId: userId as string,
          event: {
            create: {
              name: body.name,
              description: body.description,
              location: body.location,
            },
          },
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          event: true,
        },
      });

      return {
        nameUser: reserve.user.name,
        reserve,
      };
    });
  }

  async findAll() {
    return handleAsyncOperation(async () => {
      const reserves = await this.prisma.event.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          reserve: {
            select: {
              ocurrence: true,
              date_Start: true,
              date_End: true,
              hour_Start: true,
              hour_End: true,
            },
          },
        },
      });

      return reserves;
    });
  }

  async findOne(id: string) {
    return handleAsyncOperation(async () => {
      const reserve = await this.prisma.event.findFirst({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          reserve: {
            select: {
              ocurrence: true,
              date_Start: true,
              hour_Start: true,
              hour_End: true,
            },
          },
        },
      });

      if (!reserve) {
        throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
      }

      return reserve;
    });
  }

  async update(id: string, req: Request, body: UpdateReserveEventDto) {
    const userId = req.user?.id as string;
    await validateUser(userId, 'Você só pode atualizar suas reservas');

    const dateStart = new Date(body.date_Start);
    const dateEnd = new Date(body.date_End);

    await checkConflictingReserves(
      dateStart,
      dateEnd,
      body.hour_Start,
      body.hour_End,
    );

    return handleAsyncOperation(async () => {
      const reserveUpdated = await this.prisma.reserve.update({
        where: { id },
        data: {
          ocurrence: body.ocurrence,
          date_Start: dateStart,
          date_End: dateEnd,
          hour_Start: body.hour_Start,
          hour_End: body.hour_End,
          event: {
            update: {
              name: body.name,
              description: body.description,
              location: body.location,
            },
          },
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          event: true,
        },
      });

      return {
        nameUser: reserveUpdated.user.name,
        reserveUpdated,
      };
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const reserve = await prisma.event.findFirst({ where: { id } });

      if (!reserve) {
        throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
      }

      await prisma.event.delete({ where: { id } });

      await prisma.reserve.delete({
        where: { id: reserve.reserveId },
      });

      return {
        message: 'Reserva deletada com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    });
  }
}
