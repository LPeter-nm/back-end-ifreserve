import { HttpException, HttpStatus } from '@nestjs/common';

export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw new HttpException(error.message as string, HttpStatus.BAD_REQUEST);
  }
}
