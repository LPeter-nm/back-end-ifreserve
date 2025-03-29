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
import { ReportService } from './report.service';
import { CreateReportDto, UpdateReportDto } from './dto/reportDto';
import { Request } from 'express';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Relatório')
@UseGuards(PoliciesGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post(':sportId')
  @ApiResponse({ status: 200, description: 'Relatório criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar relatório' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  create(
    @Body() createReportDto: CreateReportDto,
    @Req() req: Request,
    @Param('sportId') reserveId: string,
  ) {
    return this.reportService.create(createReportDto, req, reserveId);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Relatórios listado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao listar relatórios' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Relatório listado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao listar relatório' })
  @ApiResponse({ status: 404, description: 'Relatório não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Relatório atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao atualizar relatório' })
  @ApiResponse({ status: 404, description: 'Relatório não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(id, updateReportDto);
  }

  @Patch('status/:id')
  @ApiResponse({ status: 200, description: 'Relatório atualizado com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Erro ao atualizar status do relatório',
  })
  @ApiResponse({ status: 404, description: 'Relatório não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  updateStatus(@Param('id') id: string, @Body() body: UpdateReportDto) {
    return this.reportService.updateStatus(id, body);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Relatório deletado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao deletar relatório' })
  @ApiResponse({ status: 404, description: 'Relatório não encontrado' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  remove(@Param('id') id: string) {
    return this.reportService.remove(id);
  }
}
