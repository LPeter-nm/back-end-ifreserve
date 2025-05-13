import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateReserveClassroomDto,
  UpdateReserveClassroomDto,
} from './dto/classroomDto';
import { PutCommentsDto } from '../reserve/dto/reserveDto';
import { PrismaService } from 'src/database/PrismaService';
import { Request } from 'express';
import { validateUser } from 'src/validations/authValidate';
import { checkConflictingReserves } from 'src/validations/datetimeValidate';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { validateReservationDates } from 'src/validations/reservationDateValidate';
import { NotificationService } from '../notification/notification.service';
import { TypeNotification } from '../notification/dto/notificationDto';

@Injectable()
export class ReserveClassroomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(body: CreateReserveClassroomDto, req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    const validateDate = validateReservationDates(
      body.dateTimeStart,
      body.dateTimeEnd,
    );

    await checkConflictingReserves(body.dateTimeStart, body.dateTimeEnd);

    return handleAsyncOperation(async () => {
      const reserve = await this.prisma.reserve.create({
        data: {
          type_Reserve: 'AULA',
          occurrence: body.occurrence,
          dateTimeStart: validateDate.dateTime_Start,
          dateTimeEnd: validateDate.dateTime_End,
          userId,
          classroom: {
            create: {
              course: body.course,
              matter: body.matter,
            },
          },
        },
        include: {
          user: {
            select: {
              name: true,
              role: true,
              typeUser: true,
            },
          },
          classroom: true,
        },
      });

      if (
        reserve.user.role === 'SISTEMA_ADMIN' ||
        reserve.user.role === 'PE_ADMIN'
      ) {
        const updateRegistered = await this.prisma.reserve.update({
          where: { id: reserve.id },
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
          message: 'Reserva solicitada com sucesso',
          reserve,
        };
      }
    });
  }

  findOne(id: string) {
    return handleAsyncOperation(async () => {
      const reserve = await this.prisma.classroom.findFirst({
        where: { id },
        select: {
          id: true,
          course: true,
          matter: true,
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

  async update(id: string, req: Request, body: UpdateReserveClassroomDto) {
    const userId = req.user?.id as string;
    await validateUser(userId);

    const classroomFind = await this.prisma.reserve.findFirst({
      where: { id: id },
    });

    if (!classroomFind) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const validateDate = validateReservationDates(
      body.dateTimeStart,
      body.dateTimeEnd,
    );

    await checkConflictingReserves(body.dateTimeStart, body.dateTimeEnd, id);

    return handleAsyncOperation(async () => {
      const updatedReserve = await this.prisma.reserve.update({
        where: { id: id },
        data: {
          occurrence: body.occurrence,
          dateTimeStart: validateDate.dateTime_Start,
          dateTimeEnd: validateDate.dateTime_End,
          classroom: {
            update: {
              course: body.course,
              matter: body.matter,
            },
          },
        },
        include: {
          classroom: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        message: 'Reserva atualizada com sucesso',
        updatedReserve,
      };
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const reserve = await prisma.classroom.findFirst({ where: { id } });

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
