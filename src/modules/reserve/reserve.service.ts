import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/PrismaService';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { NotificationService } from '../notification/notification.service';
import { PutCommentsDto } from './dto/reserveDto';
import { Request } from 'express';
import { TypeNotification } from '../notification/dto/notificationDto';

@Injectable()
export class ReserveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async findAllConfirm() {
    return handleAsyncOperation(async () => {
      const reserves = await this.prisma.reserve.findMany({
        where: {
          AND: [
            {
              OR: [{ status: 'CONFIRMADA' }, { status: 'CADASTRADO' }],
            },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
              typeUser: true,
            },
          },
          sport: true,
          classroom: true,
          event: true,
        },
      });

      return reserves;
    });
  }

  async findAll() {
    return handleAsyncOperation(async () => {
      const reserves = await this.prisma.reserve.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
              typeUser: true,
            },
          },
          sport: {
            include: {
              report: true,
            },
          },
          classroom: true,
          event: true,
        },
      });

      return reserves;
    });
  }

  async findAllUser(req: Request) {
    return handleAsyncOperation(async () => {
      const userId = req.user?.id;
      const reserves = await this.prisma.reserve.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
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
        where: { id: id },
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

  async updateConfirmed(req: Request, id: string, body: PutCommentsDto) {
    const reserve = await this.prisma.reserve.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const userAdmin = await this.prisma.user.findFirst({
      where: { id: req.user?.id },
    });

    return handleAsyncOperation(async () => {
      const confirmedReserve = await this.prisma.reserve.update({
        where: { id },
        data: {
          answeredBy: userAdmin?.name,
          comments: body.comments,
          status: 'CONFIRMADA',
        },
        include: {
          user: true,
        },
      });

      await this.notificationService.create(
        'Reserva Confirmada',
        `Sua reserva foi confirmada pelo servidor ${confirmedReserve.answeredBy}`,
        'RESERVA_CONFIRMADA' as TypeNotification,
        req,
        '/view-reserves',
        confirmedReserve.user.id,
      );

      return confirmedReserve;
    });
  }

  async updateCanceled(req: Request, id: string, body: PutCommentsDto) {
    const reserve = await this.prisma.reserve.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const userAdmin = await this.prisma.user.findFirst({
      where: { id: req.user?.id },
    });

    return handleAsyncOperation(async () => {
      const canceledReserve = await this.prisma.reserve.update({
        where: { id },
        data: {
          answeredBy: userAdmin?.name,
          comments: body.comments,
          status: 'CANCELADA',
        },
        include: {
          user: true,
        },
      });

      return canceledReserve;
    });
  }

  async updateRefused(req: Request, id: string, body: PutCommentsDto) {
    const reserve = await this.prisma.reserve.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const userAdmin = await this.prisma.user.findFirst({
      where: { id: req.user?.id },
    });

    return handleAsyncOperation(async () => {
      const refusedReserve = await this.prisma.reserve.update({
        where: { id },
        data: {
          answeredBy: userAdmin?.name,
          comments: body.comments,
          status: 'RECUSADA',
        },
        include: {
          user: true,
        },
      });

      await this.notificationService.create(
        'Reserva Recusada',
        `Sua reserva foi recusada pelo servidor ${refusedReserve.answeredBy}`,
        'RESERVA_RECUSADA' as TypeNotification,
        req,
        '/view-reserves',
        refusedReserve.user.id,
      );

      return refusedReserve;
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const reserve = await prisma.reserve.findFirst({ where: { id } });

      if (!reserve) {
        throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
      }

      await prisma.reserve.delete({
        where: { id },
      });

      return {
        message: 'Reserva deletada com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    });
  }
}
