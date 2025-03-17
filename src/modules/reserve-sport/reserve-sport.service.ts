import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateReserveSportDto,
  UpdateReserveSportDto,
  UpdateStatusSportDto,
} from './dto/sportDto';
import { PrismaService } from 'src/database/PrismaService';
import { Request } from 'express';
import { handleAsyncOperation } from 'src/errors/try-catch';

@Injectable()
export class ReserveSportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateReserveSportDto, req: Request) {
    const userId = req.user?.id;
    const userCheck = await this.prisma.user.findFirst({
      where: { id: userId },
    });

    if (!userCheck) {
      throw new HttpException(
        'Usuário necessita estar autenticado para solicitar reserva',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const dateStart = new Date(body.date_Start);
    const dateEnd = new Date(body.date_End);

    const reserveCheck = await this.prisma.reserve.findFirst({
      where: { userId },
    });

    if (reserveCheck) {
      const sportReserves = await this.prisma.sport.findMany({
        where: {
          reserveId: reserveCheck.id,
        },
      });

      sportReserves.map(async (sport) => {
        if (sport.status === 'PENDENTE') {
          throw new HttpException(
            'Reservas ainda não resolvidas',
            HttpStatus.CONFLICT,
          );
        }
      });
    }

    return handleAsyncOperation(async () => {
      const reserveRequest = await this.prisma.reserve.create({
        data: {
          Type_Reserve: 'OFICIO',
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
      });

      return {
        nameUser: userCheck.name,
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
    const verifyUserReserve = await this.prisma.reserve.findFirst({
      where: { userId: req.user?.id },
    });

    if (!verifyUserReserve) {
      throw new HttpException(
        'Você só pode atualizar as suas reservas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const reserve = await this.prisma.sport.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const dateStart = new Date(body.date_Start as string);
    const dateEnd = new Date(body.date_End as string);

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

  async updateCanceled(req: Request, id: string) {
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
    const reserve = await this.prisma.sport.findFirst({ where: { id } });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }
    return handleAsyncOperation(async () => {
      await this.prisma.sport.delete({ where: { id } });

      return {
        message: 'Reserva deletada com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    });
  }
}
