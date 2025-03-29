import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UserInternalService } from './user-internal.service';
import {
  CreateUserInternalDto,
  UpdateUserInternalDto,
} from './dto/userInternalDTO';
import { Public } from '../auth/skipAuth/skipAuth';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuário Interno')
@UseGuards(PoliciesGuard)
@Controller('user-internal')
export class UserInternalController {
  constructor(private readonly userInternalService: UserInternalService) {}

  @Public()
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Usuário interno registrado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao registrar usuário interno',
  })
  @ApiResponse({
    status: 403,
    description: 'Rota somente para usuário internos',
  })
  @ApiResponse({ status: 409, description: 'Usuário já cadastrado' })
  @ApiResponse({ status: 417, description: 'Erro inesperado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  create(@Body() body: CreateUserInternalDto, @Req() req: Request) {
    return this.userInternalService.register(body, req);
  }

  @Get('users')
  @ApiResponse({
    status: 200,
    description: 'Usuários listados com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao listar usuários',
  })
  @ApiResponse({
    status: 401,
    description: 'Rota somente para administrador geral',
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.General, 'all'))
  findAll() {
    return this.userInternalService.findAll();
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Usuário listado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao listar usuário',
  })
  @ApiResponse({
    status: 401,
    description: 'Rota somente para usuários autenticados',
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  findOne(@Req() req: Request) {
    return this.userInternalService.findOne(req);
  }

  @Put()
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao atualizar usuário',
  })
  @ApiResponse({
    status: 401,
    description: 'Rota somente para usuários autenticados',
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  update(@Body() body: UpdateUserInternalDto, @Req() req: Request) {
    return this.userInternalService.update(body, req);
  }

  @Delete()
  @ApiResponse({
    status: 204,
    description: 'Usuário deletado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao deletar usuário',
  })
  @ApiResponse({
    status: 401,
    description: 'Rota somente para usuários autenticados',
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  delete(@Req() req: Request) {
    return this.userInternalService.delete(req);
  }
}
