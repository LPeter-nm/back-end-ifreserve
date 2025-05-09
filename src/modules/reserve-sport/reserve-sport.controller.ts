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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Reserva - Ofício')
@UseGuards(PoliciesGuard)
@Controller('reserve-sport')
export class ReserveSportController {
  constructor(private readonly reserveSportService: ReserveSportService) {}

  @Post('request')
  @ApiResponse({ status: 200, description: 'Reserva criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 409, description: 'Erro de conflito de horários' })
  @ApiResponse({ status: 417, description: 'Datas inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  create(@Body() body: CreateReserveSportDto, @Req() req: Request) {
    return this.reserveSportService.create(body, req);
  }

  @Get(':sportId')
  @ApiResponse({ status: 200, description: 'Reservas listadas com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @Public()
  findOne(@Param('sportId') sportId: string) {
    return this.reserveSportService.findOne(sportId);
  }

  @Patch(':sportId')
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 409, description: 'Erro de conflito de horários' })
  @ApiResponse({ status: 417, description: 'Datas inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  update(
    @Req() req: Request,
    @Param('sportId') sportId: string,
    @Body() body: UpdateReserveSportDto,
  ) {
    return this.reserveSportService.update(req, sportId, body);
  }

  @Delete(':sportId')
  @ApiResponse({ status: 200, description: 'Reserva deletada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao deletar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  remove(@Param('sportId') sportId: string) {
    return this.reserveSportService.remove(sportId);
  }
}
