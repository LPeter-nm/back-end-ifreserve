import { PartialType } from '@nestjs/mapped-types';
import { CreateReserveEventDto } from './create-reserve-event.dto';

export class UpdateReserveEventDto extends PartialType(CreateReserveEventDto) {}
