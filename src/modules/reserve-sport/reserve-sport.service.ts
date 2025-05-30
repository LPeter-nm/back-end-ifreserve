import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReserveSportDto, UpdateReserveSportDto } from './dto/sportDto';
import { PrismaService } from 'src/database/PrismaService';
import { Request } from 'express';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { validateUser } from 'src/validations/authValidate';
import { validateReservationDates } from 'src/validations/reservationDateValidate';
import { NotificationService } from '../notification/notification.service';
// Importe diretamente do módulo promises
import { writeFile, mkdir } from 'fs/promises';
// ou alternativamente
import * as fs from 'fs/promises';

import { checkConflictingReserves } from 'src/validations/datetimeValidate';
import path from 'path';

@Injectable()
export class ReserveSportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    body: CreateReserveSportDto,
    req: Request,
    pdfFile?: Express.Multer.File,
  ) {
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
          type_Reserve: 'OFICIO',
          occurrence: body.occurrence,
          dateTimeStart: validateDate.dateTime_Start,
          dateTimeEnd: validateDate.dateTime_End,
          userId: userId,
          sport: {
            create: {
              typePractice: body.typePractice,
              numberParticipants: Number(body.numberParticipants),
              participants: body.participants,
              requestEquipment: body.requestEquipment,
              pdfUrl: pdfFile?.path,
              pdfName: pdfFile?.originalname,
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
        reserve.user.role === 'PE_ADMIN' ||
        reserve.user.role === 'SISTEMA_ADMIN'
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
          message: 'Reserva solicitada, aguarde confirmação ou recusa da mesma',
          reserve,
        };
      }
    });
  }

  async addFileToReserve(id: string, pdfFile: Express.Multer.File) {
    // 1. Verifica se a reserva existe
    const reserve = await this.prisma.reserve.findUnique({
      where: { id },
      include: { sport: true },
    });

    if (!reserve) {
      throw new NotFoundException('Reserva não encontrada');
    }

    // 2. Cria o diretório se não existir
    const uploadDir = './uploads/sports';
    await fs.mkdir(uploadDir, { recursive: true });

    // 3. Define o caminho do arquivo (mantendo sua lógica original)
    const filePath = path.join(uploadDir, `${id}-${pdfFile.originalname}`);

    // 4. Salva o arquivo (usando promises corretamente)
    await fs.writeFile(filePath, pdfFile.buffer);

    // 5. Atualiza no banco de dados (igual ao seu original)
    return this.prisma.sport.update({
      where: { reserveId: id },
      data: {
        pdfUrl: filePath,
        pdfName: pdfFile.originalname,
      },
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

  async update(req: Request, id: string, body: UpdateReserveSportDto) {
    const userId = req.user?.id as string;
    await validateUser(userId, 'Você só pode atualizar suas reservas');

    const reserve = await this.prisma.reserve.findFirst({
      where: { id: id },
    });

    if (!reserve) {
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

          sport: {
            update: {
              typePractice: body.typePractice,
              numberParticipants: Number(body.numberParticipants),
              participants: body.participants,
              requestEquipment: body.requestEquipment,
            },
          },
        },
        include: {
          sport: true,
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      });

      if (
        updatedReserve.user.role === 'PE_ADMIN' ||
        updatedReserve.user.role === 'SISTEMA_ADMIN'
      ) {
        await this.prisma.reserve.update({
          where: { id: updatedReserve.id },
          data: {
            status: 'CADASTRADO',
          },
        });
      }

      return {
        message: 'Reserva atualizada com sucesso',
        updatedReserve,
      };
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
