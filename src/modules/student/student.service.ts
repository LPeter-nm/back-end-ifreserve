import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto, UpdateStudentDto } from './dto/studentDto';
import { PrismaService } from 'src/database/PrismaService';
import { handleAsyncOperation } from 'src/validations/prismaValidate';
import { randomInt } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { validateUser } from 'src/validations/authValidate';
import { PaginationDto } from 'src/common/dto/paginationDto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateStudentDto) {
    const userRegistered = await this.prisma.user.findFirst({
      where: {
        AND: [
          {
            OR: [
              { identification: body.identification },
              { email: body.email },
            ],
          },
        ],
      },
    });

    if (userRegistered) {
      throw new HttpException(
        'Usuário já cadastrado no sistema',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.password.length < 8) {
      throw new HttpException(
        'É necessário que sua senha tenha pelo menos 8 caracteres',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const identificationCheck = /^\d{5}TMN\.[A-Z]{3}\d{4}$/;

    if (!identificationCheck.test(body.identification)) {
      throw new HttpException(
        'O número de matrícula está no formato incorreto. Use o padrão: 00000TMN.XXX0000',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return handleAsyncOperation(async () => {
      const randomPass = randomInt(10, 16);
      const hashedPassword = await bcrypt.hash(body.password, randomPass);

      if (!body.email.includes('@acad.ifma.edu.br')) {
        throw new HttpException(
          'O Email está incorreto',
          HttpStatus.BAD_REQUEST,
        );
      }

      const registerStudent = await this.prisma.user.create({
        data: {
          name: body.name,
          identification: body.identification,
          email: body.email,
          password: hashedPassword,
          typeUser: 'ALUNO',
          student: {
            create: {},
          },
        },
      });

      return registerStudent;
    });
  }

  findAll(paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const offSet = (page - 1) * pageSize;

    return handleAsyncOperation(async () => {
      const students = await this.prisma.student.findMany({
        skip: offSet,
        take: Number(pageSize),
        orderBy: { id: 'desc' },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              identification: true,
              status: true,
            },
          },
        },
      });

      const totalStudents = await this.prisma.student.count();

      return {
        data: students,
        totalPages: Math.ceil(totalStudents / pageSize),
        currentPage: page,
      };
    });
  }

  async findOne(req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    return handleAsyncOperation(async () => {
      const student = await this.prisma.user.findFirst({
        where: { id: userId },
        select: {
          name: true,
          email: true,
          identification: true,
          status: true,
        },
      });

      if (!student) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      return student;
    });
  }

  async update(body: UpdateStudentDto, req: Request) {
    const userId = req.user?.id as string;

    await validateUser(userId);

    const randomPass = randomInt(10, 16);
    const hashedPassword = await bcrypt.hash(
      body.password as string,
      randomPass,
    );

    return handleAsyncOperation(async () => {
      const studentUpdated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: body.name,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          identification: true,
        },
      });

      return studentUpdated;
    });
  }

  remove(req: Request) {
    return this.prisma.$transaction(async (prisma) => {
      const userId = req.user?.id as string;

      await validateUser(userId);

      await prisma.user.update({
        where: { id: userId },
        data: {
          status: 'INATIVO',
          student: {
            delete: {
              userId,
            },
          },
        },
      });

      return {
        message: 'Usuário deletado com sucesso',
        status: HttpStatus.NO_CONTENT,
      };
    });
  }
}
