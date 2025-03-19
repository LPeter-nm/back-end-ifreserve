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
import { ReserveEventService } from './reserve-event.service';
import { CreateReserveEventDto, UpdateReserveEventDto } from './dto/eventDto';
import { Request } from 'express';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { Public } from '../auth/skipAuth/skipAuth';

@UseGuards(PoliciesGuard)
@Controller('reserve-event')
export class ReserveEventController {
  constructor(private readonly reserveEventService: ReserveEventService) {}

  @Post()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  create(
    @Body() createReserveEventDto: CreateReserveEventDto,
    @Req() req: Request,
  ) {
    return this.reserveEventService.create(createReserveEventDto, req);
  }

  @Get('reserves')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  findAll() {
    return this.reserveEventService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.reserveEventService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: UpdateReserveEventDto,
  ) {
    return this.reserveEventService.update(id, req, body);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  remove(@Param('id') id: string) {
    return this.reserveEventService.remove(id);
  }
}
