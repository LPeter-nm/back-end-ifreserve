import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReserveSportDto, UpdateReserveSportDto } from './dto/sportDto';
import { PrismaService } from 'src/database/PrismaService';
import { Request } from 'express';

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
        HttpStatus.FORBIDDEN,
      );
    }

    const dateStart = new Date(body.date_Start);
    const dateEnd = new Date(body.date_End);

    try {
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
    } catch (error) {
      throw new HttpException(error as string, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return `This action returns all reserveSport`;
  }

  findOne(id: string) {
    return `This action returns a #${id} reserveSport`;
  }

  update(id: string, updateReserveSportDto: UpdateReserveSportDto) {
    return `This action updates a #${id} reserveSport`;
  }

  updateConfirmed(id: string) {}

  updateCanceled(id: string) {}

  updateRefused(id: string) {}

  remove(id: string) {
    return `This action removes a #${id} reserveSport`;
  }
}
