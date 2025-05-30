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

    const findReserves = await this.prisma.reserve.findMany({
      where: {
        userId,
      },
    });

    if (findReserves) {
      findReserves.map((ped) => {
        if (ped.status === 'PENDENTE') {
          throw new HttpException(
            'Você tem reservas ainda não resolvidas',
            HttpStatus.CONFLICT,
          );
        }
      });
    }

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

  async update(id: string, req: Request, body: UpdateReserveEventDto) {
    const userId = req.user?.id as string;
    await validateUser(userId, 'Você só pode atualizar suas reservas');

    const reserveFind = await this.prisma.reserve.findFirst({
      where: {
        id: id,
      },
    });

    if (!reserveFind) {
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
          event: {
            update: {
              name: body.name,
              description: body.description,
              location: body.location,
            },
          },
        },
        include: {
          event: true,

          user: {
            select: {
              name: true,
            },
          },
        },
      });

      return {
        message: 'Reserva atualizada com sucesso',
        nameUser: updatedReserve.user.name,
        updatedReserve,
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
