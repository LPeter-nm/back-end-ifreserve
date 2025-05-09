import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReserveSportDto, UpdateReserveSportDto } from './dto/sportDto';
import { PrismaService } from 'src/database/PrismaService';
import { Request } from 'express';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { validateUser } from 'src/validations/authValidate';
import { validateReservationDates } from 'src/validations/reservationDateValidate';
import { NotificationService } from '../notification/notification.service';

import { checkConflictingReserves } from 'src/validations/datetimeValidate';

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
      body.dateTimeStart,
      body.dateTimeEnd,
    );

    const reserveCheck = await this.prisma.reserve.findFirst({
      where: { userId },
    });
    await checkConflictingReserves(body.dateTimeStart, body.dateTimeEnd);

    if (reserveCheck) {
      const pendingReserves = await this.prisma.reserve.findMany({
        where: {
          id: reserveCheck.id,
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

    return handleAsyncOperation(async () => {
      const reserveRequest = await this.prisma.reserve.create({
        data: {
          type_Reserve: 'OFICIO',
          occurrence: body.occurrence,
          dateTimeStart: validateDate.dateTime_Start,
          dateTimeEnd: validateDate.dateTime_End,
          userId: userId,
          sport: {
            create: {
              typePractice: body.typePractice,
              numberParticipants: body.numberParticipants,
              participants: body.participants,
              requestEquipment: body.requestEquipment,
            },
          },
        },
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
          sport: true,
        },
      });

      if (
        reserveRequest.user.role === 'PE_ADMIN' ||
        reserveRequest.user.role === 'SISTEMA_ADMIN'
      ) {
        const updateRegistered = await this.prisma.reserve.update({
          where: { id: reserveRequest.id },
          data: {
            status: 'CADASTRADO',
          },
        });

        return {
          message: 'Reserva cadastrada com sucesso',
          updateRegistered,
        };
      } else {
        return {
          message: 'Reserva solicitada, aguarde confirmação ou recusa da mesma',
          reserveRequest,
        };
      }
    });
  }

  async findOne(id: string) {
    return handleAsyncOperation(async () => {
      const reserve = await this.prisma.sport.findFirst({
        where: { id },
        select: {
          id: true,
          typePractice: true,
          numberParticipants: true,
          requestEquipment: true,
          reserve: {
            select: {
              status: true,
              occurrence: true,
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

  async update(req: Request, sportId: string, body: UpdateReserveSportDto) {
    const userId = req.user?.id as string;
    await validateUser(userId, 'Você só pode atualizar suas reservas');

    const reserve = await this.prisma.sport.findFirst({
      where: { id: sportId },
    });

    if (!reserve) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const validateDate = validateReservationDates(
      body.dateTimeStart,
      body.dateTimeEnd,
    );

    await checkConflictingReserves(body.dateTimeStart, body.dateTimeEnd);

    return handleAsyncOperation(async () => {
      const updatedReserve = await this.prisma.sport.update({
        where: { id: sportId },
        data: {
          typePractice: body.typePractice,
          numberParticipants: body.numberParticipants,
          participants: body.participants,
          requestEquipment: body.requestEquipment,
          reserve: {
            update: {
              occurrence: body.occurrence,
              dateTimeStart: validateDate.dateTime_Start,
              dateTimeEnd: validateDate.dateTime_End,
            },
          },
        },
        include: {
          reserve: {
            select: {
              user: {
                select: {
                  name: true,
                  role: true,
                },
              },
            },
          },
        },
      });

      if (
        updatedReserve.reserve.user.role === 'PE_ADMIN' ||
        updatedReserve.reserve.user.role === 'SISTEMA_ADMIN'
      ) {
        const updateRegistered = await this.prisma.reserve.update({
          where: { id: updatedReserve.id },
          data: {
            status: 'CADASTRADO',
          },
        });

        return {
          message: 'Reserva atualizada com sucesso',
          updateRegistered,
        };
      } else {
        return {
          message: 'Reserva atualizada com sucesso',
          updatedReserve,
        };
      }
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const reserve = await prisma.sport.findFirst({ where: { id } });

      if (!reserve) {
        throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
      }

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
