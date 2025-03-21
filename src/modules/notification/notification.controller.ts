import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { Request } from 'express';

@UseGuards(PoliciesGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  findAll(@Req() req: Request) {
    return this.notificationService.findAll(req);
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
