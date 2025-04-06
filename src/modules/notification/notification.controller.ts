import { Controller, Get, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { Request } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notificação')
@UseGuards(PoliciesGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Notificações listadas com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Erro ao listar notificações' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  findAll(@Req() req: Request) {
    return this.notificationService.findAll(req);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Notificação deletada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Erro ao deletar notificação' })
  @ApiResponse({ status: 404, description: 'Notificação não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Notificações deletadas com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Erro ao deletar notificação' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  removeAll(req: Request) {
    return this.notificationService.removeAll(req);
  }
}
