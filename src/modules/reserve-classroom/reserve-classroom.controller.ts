import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReserveClassroomService } from './reserve-classroom.service';
import {
  CreateReserveClassroomDto,
  UpdateReserveClassroomDto,
} from './dto/classroomDto';
import { Request } from 'express';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { Public } from '../auth/skipAuth/skipAuth';

UseGuards(PoliciesGuard);
@Controller('reserve-classroom')
export class ReserveClassroomController {
  constructor(
    private readonly reserveClassroomService: ReserveClassroomService,
  ) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  create(@Body() body: CreateReserveClassroomDto, @Req() req: Request) {
    return this.reserveClassroomService.create(body, req);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  findAll() {
    return this.reserveClassroomService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.reserveClassroomService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateReserveClassroomDto,
    @Req() req: Request,
  ) {
    return this.reserveClassroomService.update(id, req, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reserveClassroomService.remove(id);
  }
}
