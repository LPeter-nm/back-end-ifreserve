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
import { UserExternalService } from './user-external.service';
import {
  CreateUserExternalDto,
  UpdateUserExternalDto,
} from './dto/userExternalDTO';
import { Public } from '../auth/skipAuth/skipAuth';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Usuário Externo')
@UseGuards(PoliciesGuard)
@Controller('user-external')
export class UserExternalController {
  constructor(private readonly userExternalService: UserExternalService) {}

  @Public()
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Usuário externo registrado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao registrar usuário externo',
  })
  @ApiResponse({ status: 409, description: 'Usuário já cadastrado' })
  @ApiResponse({ status: 417, description: 'Erro inesperado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  create(@Body() body: CreateUserExternalDto) {
    return this.userExternalService.registerExternal(body);
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
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  findAll() {
    return this.userExternalService.findAll();
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
    return this.userExternalService.findOne(req);
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
  update(@Body() body: UpdateUserExternalDto, @Req() req: Request) {
    return this.userExternalService.update(req, body);
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
  remove(@Req() req: Request) {
    return this.userExternalService.delete(req);
  }
}
