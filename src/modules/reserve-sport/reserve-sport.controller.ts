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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ReserveSportService } from './reserve-sport.service';
import { CreateReserveSportDto, UpdateReserveSportDto } from './dto/sportDto';
import { Request } from 'express';
import { PoliciesGuard } from '../casl/guards/policies.guard';
import { CheckPolicies } from '../casl/guards/policies.check';
import { AppAbility } from '../casl/casl-ability.factory/casl-ability.factory';
import { Action } from '../casl/casl-ability.factory/actionDTO/casl-actionDTO';
import { Public } from '../auth/skipAuth/skipAuth';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Reserva - Ofício')
@UseGuards(PoliciesGuard)
@Controller('reserve-sport')
export class ReserveSportController {
  constructor(private readonly reserveSportService: ReserveSportService) {}

  @Post('request')
  @ApiResponse({ status: 200, description: 'Reserva criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 409, description: 'Erro de conflito de horários' })
  @ApiResponse({ status: 417, description: 'Datas inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  @UseInterceptors(
    FileInterceptor('pdfFile', {
      storage: diskStorage({
        destination: './uploads/sports',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Apenas arquivos PDF são permitidos'), false);
        }
      },
    }),
  )
  async create(
    @Body() body: CreateReserveSportDto,
    @UploadedFile() pdfFile: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.reserveSportService.create(body, req, pdfFile);
  }

  @Get(':sportId')
  @ApiResponse({ status: 200, description: 'Reservas listadas com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @Public()
  findOne(@Param('sportId') sportId: string) {
    return this.reserveSportService.findOne(sportId);
  }

  @Patch(':id/upload')
  @UseInterceptors(FileInterceptor('pdfFile'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFile() pdfFile: Express.Multer.File,
  ) {
    return this.reserveSportService.addFileToReserve(id, pdfFile);
  }
  @Patch(':sportId')
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao criar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 401, description: 'Erro na requisição do usuário' })
  @ApiResponse({ status: 409, description: 'Erro de conflito de horários' })
  @ApiResponse({ status: 417, description: 'Datas inválidas' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @ApiBearerAuth('access_token')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.User, 'all'))
  update(
    @Req() req: Request,
    @Param('sportId') sportId: string,
    @Body() body: UpdateReserveSportDto,
  ) {
    return this.reserveSportService.update(req, sportId, body);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Reserva deletada com sucesso' })
  @ApiResponse({ status: 400, description: 'Erro ao deletar reserva' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @ApiResponse({ status: 500, description: 'Erro interno do servidor' })
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Control, 'all'))
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Manage, 'all'))
  remove(@Param('id') id: string) {
    return this.reserveSportService.remove(id);
  }
}
