import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/studentDto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { Public } from '../auth/skipAuth/skipAuth';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { Request } from 'express';

@ApiTags('Aluno')
@UseGuards(PoliciesGuard)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Public()
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Aluno registrado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Erro ao registrar aluno',
  })
  @ApiResponse({ status: 409, description: 'Usuário já cadastrado' })
  @ApiResponse({ status: 417, description: 'Erro inesperado' })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  create(@Body() body: CreateStudentDto) {
    return this.studentService.create(body);
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
    return this.studentService.findAll();
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
    return this.studentService.findOne(req);
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
  update(@Req() req: Request, @Body() body: UpdateStudentDto) {
    return this.studentService.update(body, req);
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
    return this.studentService.remove(req);
  }
}
