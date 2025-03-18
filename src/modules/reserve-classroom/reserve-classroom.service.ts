import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateReserveClassroomDto,
  UpdateReserveClassroomDto,
} from './dto/classroomDto';
import { PrismaService } from 'src/database/PrismaService';
import { Request } from 'express';
import { validateUser } from 'src/validations/authValidate';
import { checkConflictingReserves } from 'src/validations/datetimeValidate';
import { handleAsyncOperation } from 'src/validations/prismaValidate';

@Injectable()
export class ReserveClassroomService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateReserveClassroomDto, req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    const dateStart = new Date(body.date_Start);
    const dateEnd = new Date(body.date_End);

    await checkConflictingReserves(
      dateStart,
      dateEnd,
      body.hour_Start,
      body.date_End,
    );

    return handleAsyncOperation(async () => {
      const reserve = await this.prisma.reserve.create({
        data: {
          type_Reserve: 'AULA',
          ocurrence: body.ocurrence,
          date_Start: dateStart,
          date_End: dateEnd,
          hour_Start: body.hour_Start,
          hour_End: body.hour_End,
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
            },
          },
          classroom: true,
        },
      });

      return {
        nameUser: reserve.user.name,
        reserve,
      };
    });
  }

  findAll() {
    return handleAsyncOperation(async () => {
      const reserves = await this.prisma.classroom.findMany({
        select: {
          id: true,
          course: true,
          matter: true,
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

  async update(id: string, req: Request, body: UpdateReserveClassroomDto) {
    const userId = req.user?.id as string;
    await validateUser(userId, 'Você só pode atualizar suas reservas');

    const dateStart = new Date(body.date_Start);
    const dateEnd = new Date(body.date_End);

    return handleAsyncOperation(async () => {
      const reserveUpdated = await this.prisma.reserve.update({
        where: { id },
        data: {
          ocurrence: body.ocurrence,
          date_Start: dateStart,
          date_End: dateEnd,
          hour_Start: body.hour_Start,
          hour_End: body.hour_End,
          classroom: {
            update: {
              course: body.course,
              matter: body.matter,
            },
          },
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          classroom: true,
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
      const reserve = await prisma.classroom.findFirst({ where: { id } });

      if (!reserve) {
        throw new HttpException('Reserva não encontrada', HttpStatus.NOT_FOUND);
      }

      await prisma.classroom.delete({ where: { id } });

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
