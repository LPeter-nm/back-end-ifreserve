import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/skipAuth/skipAuth';
import { Request } from 'express';
import { PutCommentsDto } from './dto/reserveDto';

@ApiTags('Reserva')
@UseGuards(PoliciesGuard)
@Controller('reserve')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Get('reserves')
  @ApiResponse({ status: 200, description: 'Reservas listada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro listar reservas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  findAll() {
    return this.reserveService.findAll();
  }

  @Get('reserves-user')
  @ApiResponse({ status: 200, description: 'Reservas listada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro listar reservas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  findAllUser(@Req() req: Request) {
    return this.reserveService.findAllUser(req);
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
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  findOne(@Param('id') id: string) {
    return this.reserveService.findOne(id);
  }

  @Patch(':id/confirmed')
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  confirmed(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: PutCommentsDto,
  ) {
    return this.reserveService.updateConfirmed(req, id, body);
  }

  @Patch(':id/canceled')
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  canceled(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: PutCommentsDto,
  ) {
    return this.reserveService.updateCanceled(req, id, body);
  }

  @Patch(':id/refused')
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  refused(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: PutCommentsDto,
  ) {
    return this.reserveService.updateRefused(req, id, body);
  }
}
