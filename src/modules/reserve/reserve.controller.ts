import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/skipAuth/skipAuth';

@ApiTags('Reserva')
@UseGuards(PoliciesGuard)
@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Get('reserves')
  @ApiResponse({ status: 200, description: 'Reserva listada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro listar reservas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  findAll() {
    return this.reserveService.findAll();
  }

  @Get('reserves/confirm')
  @ApiResponse({ status: 200, description: 'Reserva listada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro listar reservas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @Public()
  findAllConfirm() {
    return this.reserveService.findAllConfirm();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Reserva listada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro listar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  findOne(@Param('id') id: string) {
    return this.reserveService.findOne(id);
  }
}
