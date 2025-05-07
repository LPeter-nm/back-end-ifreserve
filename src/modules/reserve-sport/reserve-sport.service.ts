import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateReserveSportDto,
  PutCommentsDto,
  UpdateReserveSportDto,
} from './dto/sportDto';
import { PrismaService } from 'src/database/PrismaService';
import { Request } from 'express';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { validateUser } from 'src/validations/authValidate';
import { validateReservationDates } from 'src/validations/reservationDateValidate';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ReserveSportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(body: CreateReserveSportDto, req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    const validateDate = validateReservationDates(
      body.date_Start,
      body.date_End,
      body.hour_Start,
      body.hour_End,
    );

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
        dateTimeStart: { lte: validateDate.date_Start },
        dateTimeEnd: { gte: validateDate.date_End },
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
          dateTimeStart: validateDate.date_Start,
          dateTimeEnd: validateDate.date_End,
          userId: userId,
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

      await this.notificationService.create(
        'Reserva solicitada',
        'Sua reserva foi solicitada com sucesso',
        req,
      );

      return {
        nameUser: reserveRequest.user.name,
        reserveRequest,
      };
    });
  }

  async findAll() {
    return handleAsyncOperation(async () => {
      const reserves = await this.prisma.sport.findMany({
        where: { status: 'CONFIRMADA' },
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
              type_Reserve: true,
              ocurrence: true,
              dateTimeStart: true,
              dateTimeEnd: true,
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
              dateTimeStart: true,
              dateTimeEnd: true,
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

    const validateDate = validateReservationDates(
      body.date_Start,
      body.date_End,
      body.hour_Start,
      body.hour_End,
    );

    const conflictingReserves = await this.prisma.reserve.findMany({
      where: {
        dateTimeStart: { lte: validateDate.date_Start },
        dateTimeEnd: { gte: validateDate.date_End },
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
              dateTimeStart: validateDate.date_Start,
              dateTimeEnd: validateDate.date_End,
            },
          },
        },
      });

      await this.notificationService.create(
        'Reserva Atualizada',
        'Sua reserva foi atualizada e solicitada com sucesso',
        req,
      );

      return updatedReserve;
    });
  }

  async updateConfirmed(req: Request, id: string, body: PutCommentsDto) {
    const reserve = await this.prisma.sport.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const userAdmin = await this.prisma.user.findFirst({
      where: { id: req.user?.id },
    });

    return handleAsyncOperation(async () => {
      const confirmedReserve = await this.prisma.sport.update({
        where: { id },
        data: {
          status: 'CONFIRMADA',
          anseweredBy: userAdmin?.name,
          comments: body.comments,
        },
        include: {
          reserve: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  identification: true,
                  type_User: true,
                },
              },
            },
          },
        },
      });

      await this.notificationService.create(
        'Reserva Confirmada',
        `Sua reserva foi atualizada pelo servidor ${confirmedReserve.anseweredBy}`,
        req,
        confirmedReserve.reserve.user.id,
      );

      return confirmedReserve;
    });
  }

  async updateCanceled(req: Request, id: string, body: PutCommentsDto) {
    const reserve = await this.prisma.sport.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const userAdmin = await this.prisma.user.findFirst({
      where: { id: req.user?.id },
    });

    return handleAsyncOperation(async () => {
      const canceledReserve = await this.prisma.sport.update({
        where: { id },
        data: {
          status: 'CANCELADA',
          anseweredBy: userAdmin?.name,
          comments: body.comments,
        },
        include: {
          reserve: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  identification: true,
                  type_User: true,
                },
              },
            },
          },
        },
      });

      await this.notificationService.create(
        'Reserva Cancelada',
        `Sua reserva foi cancelada pelo servidor ${canceledReserve.anseweredBy}`,
        req,
        canceledReserve.reserve.user.id,
      );

      return canceledReserve;
    });
  }

  async updateRefused(req: Request, id: string, body: PutCommentsDto) {
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
          comments: body.comments,
        },
        include: {
          reserve: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  identification: true,
                  type_User: true,
                },
              },
            },
          },
        },
      });

      await this.notificationService.create(
        'Reserva Recusada',
        `Sua reserva foi recusada pelo servidor ${refusedReserve.anseweredBy}`,
        req,
        refusedReserve.reserve.user.id,
      );

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
