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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Reserva - Evento')
@UseGuards(PoliciesGuard)
@Controller('reserve-event')
export class ReserveEventController {
  constructor(private readonly reserveEventService: ReserveEventService) {}

  @Post()
  @ApiResponse({ status: 200, description: 'Reserva criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 409, description: 'Erro de conflito de horários' })
  @ApiResponse({ status: 417, description: 'Datas inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  create(
    @Body() createReserveEventDto: CreateReserveEventDto,
    @Req() req: Request,
  ) {
    return this.reserveEventService.create(createReserveEventDto, req);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Reservas listadas com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @Public()
  findOne(@Param('id') id: string) {
    return this.reserveEventService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 409, description: 'Erro de conflito de horários' })
  @ApiResponse({ status: 417, description: 'Datas inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: UpdateReserveEventDto,
  ) {
    return this.reserveEventService.update(id, req, body);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Reserva deletada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao deletar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  remove(@Param('id') id: string) {
    return this.reserveEventService.remove(id);
  }
}
