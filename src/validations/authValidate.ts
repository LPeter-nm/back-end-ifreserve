import { PrismaClient } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';

const prisma = new PrismaClient();

export async function validateUser(
  userId: string,
  errorMessage: string = 'Usuário necessita estar autenticado para cadastrar reserva',
  statusCode: number = HttpStatus.UNAUTHORIZED,
) {
  const userCheck = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!userCheck) {
    throw new HttpException(errorMessage, statusCode);
  }
}
