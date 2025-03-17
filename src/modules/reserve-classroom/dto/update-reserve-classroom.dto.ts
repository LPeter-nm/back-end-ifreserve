import { PartialType } from '@nestjs/mapped-types';
import { CreateReserveClassroomDto } from './create-reserve-classroom.dto';

export class UpdateReserveClassroomDto extends PartialType(CreateReserveClassroomDto) {}
