// Importações
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

@UseGuards(PoliciesGuard)
@Controller('user-external')
export class UserExternalController {
  constructor(private readonly userExternalService: UserExternalService) {}

  @Public()
  @Post('register')
  create(@Body() body: CreateUserExternalDto, @Req() req: Request) {
    return this.userExternalService.registerExternal(body, req);
  }

  @Get('users')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.General, 'all'))
  findAll() {
    return this.userExternalService.findAll();
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  findOne(@Req() req: Request) {
    return this.userExternalService.findOne(req);
  }

  @Put()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  update(@Body() body: UpdateUserExternalDto, @Req() req: Request) {
    return this.userExternalService.update(req, body);
  }

  @Delete()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  remove(@Req() req: Request) {
    return this.userExternalService.delete(req);
  }
}
