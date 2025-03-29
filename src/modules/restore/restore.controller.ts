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
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Recuperação de senha')
@Controller('restore')
@UseGuards(PoliciesGuard)
export class RestoreController {
  constructor(private readonly restoreService: RestoreService) {}

  @Post()
  @ApiResponse({ status: 200, description: 'Código enviado ao email' })
  @ApiResponse({ status: 400, description: 'Erro ao enviar código ao email' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({
    status: 417,
    description: 'Erro ao criar token de recuperação do usuário',
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @Public()
  async create(@Body() body: PasswordRedefinition) {
    try {
      return await this.restoreService.createToken(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //somente para testes
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
  @ApiResponse({ status: 200, description: 'Token confirmado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao confirmar token' })
  @ApiResponse({ status: 401, description: 'Token não correspondente' })
  @ApiResponse({ status: 404, description: 'Token não encontrado' })
  @ApiResponse({
    status: 408,
    description: 'Token está expirado',
  })
  @ApiResponse({
    status: 409,
    description: 'Token já foi utilizado',
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @Public()
  async confirmToken(@Body() body: TokenConfirmed) {
    try {
      return await this.restoreService.confirmToken(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('new-credentials')
  @ApiResponse({ status: 200, description: 'Token confirmado com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao confirmar token' })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  @ApiResponse({ status: 404, description: 'Token não corresponde' })
  @ApiResponse({
    status: 408,
    description: 'Token está expirado',
  })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @Public()
  async updatePassword(@Body() body: NewPassword) {
    try {
      return await this.restoreService.updatePassword(body);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
