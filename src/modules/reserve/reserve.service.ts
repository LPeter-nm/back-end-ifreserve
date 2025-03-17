import { Injectable } from '@nestjs/common';

@Injectable()
export class ReserveService {
  findAll() {
    return `This action returns all reserve`;
  }

  findOne(id: string) {
    return `This action returns a #${id} reserve`;
  }

  remove(id: string) {
    return `This action removes a #${id} reserve`;
  }
}
