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
import { ReserveSportService } from './reserve-sport.service';
import { CreateReserveSportDto, UpdateReserveSportDto } from './dto/sportDto';
import { Request } from 'express';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { Public } from '../auth/skipAuth/skipAuth';

@UseGuards(PoliciesGuard)
@Controller('reserve-sport')
export class ReserveSportController {
  constructor(private readonly reserveSportService: ReserveSportService) {}

  @Post('request')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  create(@Body() body: CreateReserveSportDto, @Req() req: Request) {
    return this.reserveSportService.create(body, req);
  }

  @Get('reserves')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  findAll() {
    return this.reserveSportService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.reserveSportService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateReserveSportDto,
  ) {
    return this.reserveSportService.update(req, id, body);
  }

  @Patch(':id/confirmed')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  confirmed(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateReserveSportDto,
  ) {
    return this.reserveSportService.updateConfirmed(req, id, body);
  }

  @Patch(':id/canceled')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  canceled(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateReserveSportDto,
  ) {
    return this.reserveSportService.updateCanceled(req, id, body);
  }

  @Patch(':id/refused')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  refused(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: UpdateReserveSportDto,
  ) {
    return this.reserveSportService.updateRefused(req, id, body);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  remove(@Param('id') id: string) {
    return this.reserveSportService.remove(id);
  }
}
