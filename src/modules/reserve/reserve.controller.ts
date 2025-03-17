import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReserveService } from './reserve.service';

@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Get()
  findAll() {
    return this.reserveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reserveService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reserveService.remove(id);
  }
}
