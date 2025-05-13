import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/database/PrismaService';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { TypeNotification } from './dto/notificationDto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    title: string,
    content: string,
    type: TypeNotification,
    req: Request,
    linkTo?: string,
    userId?: string,
  ) {
    return handleAsyncOperation(async () => {
      const notification = await this.prisma.notification.create({
        data: {
          title,
          content,
          type,
          linkTo,
          userId: userId ? (userId as string) : (req.user?.id as string),
        },
      });

      return notification;
    });
  }

  async findAll(req: Request) {
    return handleAsyncOperation(async () => {
      const notifications = await this.prisma.notification.findMany({
        where: { userId: req.user?.id as string },
      });

      return notifications;
    });
  }

  async updateRead(id: string) {
    const notificationFind = await this.prisma.notification.findFirst({
      where: { id },
    });

    if (!notificationFind) {
      throw new HttpException(
        'Notificação não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return handleAsyncOperation(async () => {
      await this.prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
        },
      });

      return { message: 'Notificação visualizada' };
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const notification = await this.prisma.notification.findUnique({
        where: { id },
      });

      if (!notification) {
        throw new HttpException(
          'Notificação não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.notification.delete({
        where: { id },
      });

      return {
        message: 'Notificação deletada com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    });
  }

  async removeAll(req: Request) {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.notification.deleteMany({
        where: { userId: req.user?.id as string },
      });

      return {
        message: 'Notificações deletadas com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    });
  }
}
