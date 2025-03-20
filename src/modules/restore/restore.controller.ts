import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  NewPassword,
  PasswordRedefinition,
  TokenConfirmed,
} from './dto/restoreDto';
import { RestoreService } from './restore.service';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { Public } from '../auth/skipAuth/skipAuth';

@Controller('restore')
@UseGuards(PoliciesGuard)
export class RestoreController {
  constructor(private readonly restoreService: RestoreService) {}

  @Post()
  @Public()
  create(@Body() body: PasswordRedefinition) {
    return this.restoreService.createToken(body);
  }

  @Get(':userId')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  findAllTokens(@Param('userId') userId: string) {
    return this.restoreService.findAllTokens(userId);
  }

  @Post('confirmed')
  @Public()
  confirmToken(@Body() body: TokenConfirmed) {
    return this.restoreService.confirmToken(body);
  }

  @Patch('new-credentials')
  @Public()
  updatePassword(@Body() body: NewPassword) {
    return this.restoreService.updatePassword(body);
  }
}
