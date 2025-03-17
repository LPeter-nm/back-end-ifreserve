import { Injectable } from '@nestjs/common';
import { CreateReserveEventDto } from './dto/create-reserve-event.dto';

@Injectable()
export class ReserveEventService {
  async create(createReserveEventDto: CreateReserveEventDto) {
    return 'This action adds a new reserveEvent';
  }

  async findAll() {
    return `This action returns all reserveEvent`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} reserveEvent`;
  }

  async update(id: string) {
    return `This action updates a #${id} reserveEvent`;
  }

  async remove(id: string) {
    return `This action removes a #${id} reserveEvent`;
  }
}
