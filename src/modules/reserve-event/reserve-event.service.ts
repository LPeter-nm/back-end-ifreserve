import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReserveEventDto, UpdateReserveEventDto } from './dto/eventDto';
import { Request } from 'express';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { PrismaService } from 'src/database/PrismaService';
import { checkConflictingReserves } from 'src/validations/datetimeValidate';
import { validateUser } from 'src/validations/authValidate';
import { validateReservationDates } from 'src/validations/reservationDateValidate';

@Injectable()
export class ReserveEventService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateReserveEventDto, req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    const validateDate = validateReservationDates(
      body.date_Start,
      body.date_End,
      body.hour_Start,
      body.hour_End,
    );

    await checkConflictingReserves(
      validateDate.date_Start,
      validateDate.date_End,
    );

    return handleAsyncOperation(async () => {
      const reserve = await this.prisma.reserve.create({
        data: {
          type_Reserve: 'EVENTO',
          ocurrence: body.ocurrence,
          dateTimeStart: validateDate.date_Start,
          dateTimeEnd: validateDate.date_End,
          userId: userId,
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

  async update(id: string, req: Request, body: UpdateReserveEventDto) {
    const userId = req.user?.id as string;
    await validateUser(userId, 'Você só pode atualizar suas reservas');

    const reserveFind = await this.prisma.event.findFirst({
      where: {
        id,
      },
    });

    if (!reserveFind) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const validateDate = validateReservationDates(
      body.date_Start,
      body.date_End,
      body.hour_Start,
      body.hour_End,
    );

    await checkConflictingReserves(
      validateDate.date_Start,
      validateDate.date_End,
    );

    return handleAsyncOperation(async () => {
      const reserveUpdated = await this.prisma.reserve.update({
        where: { id },
        data: {
          ocurrence: body.ocurrence,
          dateTimeStart: validateDate.date_Start,
          dateTimeEnd: validateDate.date_End,
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
