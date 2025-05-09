import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { Public } from '../auth/skipAuth/skipAuth';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuário')
@UseGuards(PoliciesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userSvc: UserService) {}

  // Lembrar que é para apagar após termino de teste e do site em si
  @Get()
  @Public()
  findAll() {
    return this.userSvc.findAll();
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao deletar usuário' })
  @ApiResponse({
    status: 403,
    description: 'Não é permitido excluir o administrador geral',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  delete(@Param('id') id: string) {
    return this.userSvc.delete(id);
  }
}
