import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  HttpException,
  HttpStatus,
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
  async create(@Body() body: PasswordRedefinition) {
    try {
      return await this.restoreService.createToken(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':userId')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Admin, 'all'))
  async findAllTokens(@Param('userId') userId: string) {
    try {
      return await this.restoreService.findAllTokens(userId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('confirmed')
  @Public()
  async confirmToken(@Body() body: TokenConfirmed) {
    try {
      return await this.restoreService.confirmToken(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('new-credentials')
  @Public()
  async updatePassword(@Body() body: NewPassword) {
    try {
      return await this.restoreService.updatePassword(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
