import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReserveClassroomService } from './reserve-classroom.service';
import { CreateReserveClassroomDto } from './dto/create-reserve-classroom.dto';
import { UpdateReserveClassroomDto } from './dto/update-reserve-classroom.dto';

@Controller('reserve-classroom')
export class ReserveClassroomController {
  constructor(private readonly reserveClassroomService: ReserveClassroomService) {}

  @Post()
  create(@Body() createReserveClassroomDto: CreateReserveClassroomDto) {
    return this.reserveClassroomService.create(createReserveClassroomDto);
  }

  @Get()
  findAll() {
    return this.reserveClassroomService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reserveClassroomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReserveClassroomDto: UpdateReserveClassroomDto) {
    return this.reserveClassroomService.update(+id, updateReserveClassroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reserveClassroomService.remove(+id);
  }
}
