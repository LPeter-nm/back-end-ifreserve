import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto, UpdateServerDto } from './dto/serverDto';
import { Request } from 'express';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/skipAuth/skipAuth';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { PaginationDto } from 'src/common/dto/paginationDto';

@ApiTags('Servidor')
@UseGuards(PoliciesGuard)
@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Public()
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Servidor registrado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao registrar servidor',
  })
  @ApiResponse({ status: 409, description: 'Usuário já cadastrado' })
  @ApiResponse({ status: 417, description: 'Erro inesperado' })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  register(@Body() body: CreateServerDto) {
    return this.serverService.create(body);
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
  findAll(@Query() paginationDto: PaginationDto) {
    return this.serverService.findAll(paginationDto);
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
    return this.serverService.findOne(req);
  }

  @Patch()
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
  update(@Req() req: Request, @Body() updateServerDto: UpdateServerDto) {
    return this.serverService.update(updateServerDto, req);
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
    return this.serverService.remove(req);
  }
}
