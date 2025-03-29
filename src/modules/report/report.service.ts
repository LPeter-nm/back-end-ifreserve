import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReportDto, UpdateReportDto } from './dto/reportDto';
import { Request } from 'express';
import { PrismaService } from 'src/database/PrismaService';
import { validateUser } from 'src/validations/authValidate';
import { handleAsyncOperation } from 'src/validations/prismaValidate';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateReportDto, req: Request, sportId: string) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    return handleAsyncOperation(async () => {
      const userFound = await this.prisma.user.findFirst({
        where: { id: userId },
      });

      const report = await this.prisma.report.create({
        data: {
          ...body,
          name_User: userFound?.name as string,
          sportId,
        },
      });

      return report;
    });
  }

  findAll() {
    return handleAsyncOperation(async () => {
      const reports = await this.prisma.report.findMany({
        select: {
          id: true,
          name_User: true,
        },
      });

      return reports;
    });
  }

  findOne(id: string) {
    return handleAsyncOperation(async () => {
      const report = await this.prisma.report.findFirst({
        where: { id },
        select: {
          id: true,
          name_User: true,
          people_Appear: true,
          requested_Equipment: true,
          description: true,
          description_Court: true,
          description_Equipment: true,
          time_Used: true,
          date_Used: true,
          sport: true,
        },
      });

      if (!report) {
        throw new HttpException(
          'Relatório não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      return report;
    });
  }

  async update(id: string, body: UpdateReportDto) {
    const reportFound = await this.prisma.report.findFirst({ where: { id } });

    if (!reportFound) {
      throw new HttpException('Relatório não encontrado', HttpStatus.NOT_FOUND);
    }

    return handleAsyncOperation(async () => {
      const updatedReport = await this.prisma.report.update({
        where: { id },
        data: {
          ...body,
        },
      });

      return updatedReport;
    });
  }

  async updateStatus(id: string, body: UpdateReportDto) {
    const reportFound = await this.prisma.report.findFirst({ where: { id } });

    if (!reportFound) {
      throw new HttpException('Relatório não encontrado', HttpStatus.NOT_FOUND);
    }

    return handleAsyncOperation(async () => {
      const updatedReportStatus = await this.prisma.report.update({
        where: { id },
        data: {
          comments: body.comments,
          status: true,
        },
      });

      return updatedReportStatus;
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (prisma) => {
      const reportFound = await prisma.report.findFirst({ where: { id } });

      if (!reportFound) {
        throw new HttpException(
          'Relatório não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      await prisma.report.delete({ where: { id } });

      return {
        message: 'Relatório deletado com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    });
  }
}
