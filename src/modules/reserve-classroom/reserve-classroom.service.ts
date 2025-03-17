import { Injectable } from '@nestjs/common';
import { CreateReserveClassroomDto } from './dto/create-reserve-classroom.dto';
import { UpdateReserveClassroomDto } from './dto/update-reserve-classroom.dto';

@Injectable()
export class ReserveClassroomService {
  create(createReserveClassroomDto: CreateReserveClassroomDto) {
    return 'This action adds a new reserveClassroom';
  }

  findAll() {
    return `This action returns all reserveClassroom`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reserveClassroom`;
  }

  update(id: number, updateReserveClassroomDto: UpdateReserveClassroomDto) {
    return `This action updates a #${id} reserveClassroom`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserveClassroom`;
  }
}
