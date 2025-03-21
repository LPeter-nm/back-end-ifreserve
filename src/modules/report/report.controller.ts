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

@UseGuards(PoliciesGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post(':reserveId')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  create(
    @Body() createReportDto: CreateReportDto,
    @Req() req: Request,
    @Param('reserveId') reserveId: string,
  ) {
    return this.reportService.create(createReportDto, req, reserveId);
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(id, updateReportDto);
  }

  @Patch('status/:id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  updateStatus(@Param('id') id: string) {
    return this.reportService.updateStatus(id);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  remove(@Param('id') id: string) {
    return this.reportService.remove(id);
  }
}
