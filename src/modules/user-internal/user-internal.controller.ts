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

@UseGuards(PoliciesGuard)
@Controller('user-internal')
export class UserInternalController {
  constructor(private readonly userInternalService: UserInternalService) {}

  @Public()
  @Post('register')
  create(@Body() body: CreateUserInternalDto, @Req() req: Request) {
    return this.userInternalService.register(body, req);
  }

  @Get('users')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.General, 'all'))
  findAll() {
    return this.userInternalService.findAll();
  }

  @Get()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  findOne(@Req() req: Request) {
    return this.userInternalService.findOne(req);
  }

  @Put()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  update(@Body() body: UpdateUserInternalDto, @Req() req: Request) {
    return this.userInternalService.update(body, req);
  }

  @Delete()
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  delete(@Req() req: Request) {
    return this.userInternalService.delete(req);
  }
}
