import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';

const prisma = new PrismaClient();

async function createGeneral() {
  try {
    const checkGeneral = await prisma.user.findFirst({
      where: { role: 'SISTEMA_ADMIN' },
    });

    // Garantindo que haja apenas um admin geral no sistema
    if (checkGeneral)
      throw new HttpException(
        'Administrador geral já registrado',
        HttpStatus.CONFLICT,
      );

    const general = 'general_admin@example.com';
    const password = 'passexample';
    const name = 'Administrador geral';
    const registration = '00000000';

    const randomSalt = randomInt(10, 16);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    const generalAdmin = await prisma.user.create({
      data: {
        name,
        identification: registration,
        email: general,
        password: hashedPassword,
        typeUser: 'SERVIDOR',
        role: 'SISTEMA_ADMIN',
        server: {
          create: {
            roleInInstitution: 'COORDENADOR',
          },
        },
      },
    });

    console.log('Administrador geral registrado no sistema', generalAdmin);
  } catch (error) {
    console.error('Erro ao registrar admnistrador geral manualmente', error);
  } finally {
    await prisma.$disconnect();
  }
}

createGeneral();
