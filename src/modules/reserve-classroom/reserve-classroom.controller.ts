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
import { ReserveClassroomService } from './reserve-classroom.service';
import {
  CreateReserveClassroomDto,
  UpdateReserveClassroomDto,
} from './dto/classroomDto';
import { Request } from 'express';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { Public } from '../auth/skipAuth/skipAuth';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Reserva - Aula')
@UseGuards(PoliciesGuard)
@Controller('reserve-classroom')
export class ReserveClassroomController {
  constructor(
    private readonly reserveClassroomService: ReserveClassroomService,
  ) {}

  @Post()
  @ApiResponse({ status: 200, description: 'Reserva criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 409, description: 'Erro de conflito de horários' })
  @ApiResponse({ status: 417, description: 'Datas inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  create(@Body() body: CreateReserveClassroomDto, @Req() req: Request) {
    return this.reserveClassroomService.create(body, req);
  }

  @Get('reserves')
  @ApiResponse({ status: 200, description: 'Reserva listada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao listar reserva' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  findAll() {
    return this.reserveClassroomService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Reserva listada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao listar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @Public()
  findOne(@Param('id') id: string) {
    return this.reserveClassroomService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 409, description: 'Erro de conflito de horários' })
  @ApiResponse({ status: 417, description: 'Datas inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  update(
    @Param('id') id: string,
    @Body() body: UpdateReserveClassroomDto,
    @Req() req: Request,
  ) {
    return this.reserveClassroomService.update(id, req, body);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Reserva deletada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao deletar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  remove(@Param('id') id: string) {
    return this.reserveClassroomService.remove(id);
  }
}
