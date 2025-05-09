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
      body.dateTimeStart,
      body.dateTimeEnd,
    );

    await checkConflictingReserves(body.dateTimeStart, body.dateTimeEnd);

    return handleAsyncOperation(async () => {
      const reserve = await this.prisma.reserve.create({
        data: {
          type_Reserve: 'EVENTO',
          occurrence: body.occurrence,
          dateTimeStart: validateDate.dateTime_Start,
          dateTimeEnd: validateDate.dateTime_End,
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
              role: true,
            },
          },
          event: true,
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
          message:
            'Reserva solicitada, aguarde a confirmação ou a recusa da mesma',
          reserve,
        };
      }
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

  async update(eventId: string, req: Request, body: UpdateReserveEventDto) {
    const userId = req.user?.id as string;
    await validateUser(userId, 'Você só pode atualizar suas reservas');

    const reserveFind = await this.prisma.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!reserveFind) {
      throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
    }

    const validateDate = validateReservationDates(
      body.dateTimeStart,
      body.dateTimeEnd,
    );

    await checkConflictingReserves(body.dateTimeStart, body.dateTimeEnd);

    return handleAsyncOperation(async () => {
      const reserveUpdated = await this.prisma.event.update({
        where: { id: eventId },
        data: {
          name: body.name,
          description: body.description,
          location: body.location,
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
                },
              },
            },
          },
        },
      });

      return {
        nameUser: reserveUpdated.reserve.user.name,
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
