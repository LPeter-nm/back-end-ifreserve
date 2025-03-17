import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReserveEventService } from './reserve-event.service';
import { CreateReserveEventDto } from './dto/create-reserve-event.dto';

@Controller('reserve-event')
export class ReserveEventController {
  constructor(private readonly reserveEventService: ReserveEventService) {}

  @Post()
  create(@Body() createReserveEventDto: CreateReserveEventDto) {
    return this.reserveEventService.create(createReserveEventDto);
  }

  @Get()
  findAll() {
    return this.reserveEventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reserveEventService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.reserveEventService.update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reserveEventService.remove(id);
  }
}
