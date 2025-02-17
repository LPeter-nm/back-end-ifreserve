import {
  Body,
  Controller,
  Delete,
  Get,
  Next,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { Public } from '../auth/skipAuth/skipAuth';
import { CreateUserDto } from './dto/userDto';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { NextFunction, Request, Response } from 'express';
import { UserTypeMiddleware } from './middleware/type-user';

@UseGuards(PoliciesGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userSvc: UserService,
    private readonly mid: UserTypeMiddleware,
  ) {}

  @Post('type-user')
  @Public()
  register(@Body() body: CreateUserDto, @Req() req: Request) {
    return this.userSvc.choosingUserType(body, req);
  }

  // Lembrar que é para apagar após termino de teste e do site em si
  @Get()
  @Public()
  findAll() {
    return this.userSvc.findAll();
  }

  @Delete(':id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.General, 'all'))
  delete(@Param('id') id: string) {
    return this.userSvc.delete(id);
  }
}
