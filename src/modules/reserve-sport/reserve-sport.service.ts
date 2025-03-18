import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReserveSportDto, UpdateReserveSportDto } from './dto/sportDto';
import { PrismaService } from 'src/database/PrismaService';
import { Request } from 'express';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { validateUser } from 'src/validations/authValidate';

@Injectable()
export class ReserveSportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateReserveSportDto, req: Request) {
    const userId = req.user?.id;

    await validateUser(userId as string);

    const dateStart = new Date(body.date_Start);
    const dateEnd = new Date(body.date_End);

    const reserveCheck = await this.prisma.reserve.findFirst({
      where: { userId },
    });

    if (reserveCheck) {
      const pendingReserves = await this.prisma.sport.findMany({
        where: {
          reserveId: reserveCheck.id,
        },
      });

      pendingReserves.map((ped) => {
        if (ped.status === 'PENDENTE') {
          throw new HttpException(
            'Você tem reservas ainda não resolvidas',
            HttpStatus.CONFLICT,
          );
        }
      });
    }

    const conflictingReserves = await this.prisma.reserve.findMany({
      where: {
        date_Start: { lte: dateEnd },
        date_End: { gte: dateStart },
        hour_Start: { lte: body.hour_End },
        hour_End: { gte: body.hour_Start },
        sport: {
          status: 'CONFIRMADA',
        },
      },
    });

    if (conflictingReserves.length > 0) {
      throw new HttpException(
        'Já existe uma reserva confirmada para o mesmo horário e data',
        HttpStatus.CONFLICT,
      );
    }

    return handleAsyncOperation(async () => {
      const reserveRequest = await this.prisma.reserve.create({
        data: {
          type_Reserve: 'OFICIO',
          ocurrence: body.ocurrence,
          date_Start: dateStart,
          date_End: dateEnd,
          hour_Start: body.hour_Start,
          hour_End: body.hour_End,
          userId: userId as string,
          sport: {
            create: {
              type_Practice: body.type_Practice,
              number_People: body.number_People,
              participants: body.participants,
              request_Equipment: body.request_Equipment,
            },
          },
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          sport: true,
        },
      });

      return {
        nameUser: reserveRequest.user.name,
        reserveRequest,
      };
    });
  }

  async findAll() {
    return handleAsyncOperation(async () => {
      const reserves = await this.prisma.sport.findMany({
        select: {
          id: true,
          type_Practice: true,
          number_People: true,
          participants: true,
          request_Equipment: true,
          status: true,
          anseweredBy: true,
          reserve: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
              ocurrence: true,
              date_Start: true,
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
      const reserve = await this.prisma.sport.findFirst({
        where: { id },
        select: {
          id: true,
          type_Practice: true,
          number_People: true,
          request_Equipment: true,
          status: true,
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

  async update(req: Request, id: string, body: UpdateReserveSportDto) {
    const userId = req.user?.id as string;
    await validateUser(userId, 'Você só pode atualizar suas reservas');

    const reserve = await this.prisma.sport.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const dateStart = new Date(body.date_Start as string);
    const dateEnd = new Date(body.date_End as string);

    const conflictingReserves = await this.prisma.reserve.findMany({
      where: {
        date_Start: { lte: dateEnd },
        date_End: { gte: dateStart },
        hour_Start: { lte: body.hour_End },
        hour_End: { gte: body.hour_Start },
        sport: {
          status: 'CONFIRMADA',
        },
      },
    });

    if (conflictingReserves.length > 0) {
      throw new HttpException(
        'Já existe uma reserva confirmada para o mesmo horário e data',
        HttpStatus.CONFLICT,
      );
    }

    return handleAsyncOperation(async () => {
      const updatedReserve = await this.prisma.sport.update({
        where: { id },
        data: {
          type_Practice: body.type_Practice,
          number_People: body.number_People,
          participants: body.participants,
          request_Equipment: body.request_Equipment,
          reserve: {
            update: {
              ocurrence: body.ocurrence,
              date_Start: dateStart,
              date_End: dateEnd,
              hour_Start: body.hour_Start,
              hour_End: body.hour_End,
            },
          },
        },
      });

      return updatedReserve;
    });
  }

  async updateConfirmed(req: Request, id: string) {
    const reserve = await this.prisma.sport.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const userAdmin = await this.prisma.user.findFirst({
      where: { id: req.user?.id },
    });

    if (!userAdmin || userAdmin.role !== 'ADMIN') {
      throw new HttpException(
        'Apenas administradores são permitidos',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return handleAsyncOperation(async () => {
      const confirmedReserve = await this.prisma.sport.update({
        where: { id },
        data: {
          status: 'CONFIRMADA',
          anseweredBy: userAdmin.name,
        },
      });
      return confirmedReserve;
    });
  }

  async updateCanceled(req: Request, id: string, body: UpdateReserveSportDto) {
    const reserve = await this.prisma.sport.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const userAdmin = await this.prisma.user.findFirst({
      where: { id: req.user?.id },
    });

    if (!userAdmin || userAdmin.role !== 'ADMIN') {
      throw new HttpException(
        'Apenas administradores são permitidos',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return handleAsyncOperation(async () => {
      const canceledReserve = await this.prisma.sport.update({
        where: { id },
        data: {
          status: 'CANCELADA',
          anseweredBy: userAdmin.name,
          comments: body.comments,
        },
      });
      return canceledReserve;
    });
  }

  async updateRefused(req: Request, id: string) {
    const reserve = await this.prisma.sport.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const userAdmin = await this.prisma.user.findFirst({
      where: { id: req.user?.id },
    });

    if (!userAdmin || userAdmin.role !== 'ADMIN') {
      throw new HttpException(
        'Apenas administradores são permitidos',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return handleAsyncOperation(async () => {
      const refusedReserve = await this.prisma.sport.update({
        where: { id },
        data: {
          status: 'RECUSADA',
          anseweredBy: userAdmin.name,
        },
      });
      return refusedReserve;
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const reserve = await prisma.sport.findFirst({ where: { id } });

      if (!reserve) {
        throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
      }

      await prisma.sport.delete({ where: { id } });

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
