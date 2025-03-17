import { Test, TestingModule } from '@nestjs/testing';
import { ReserveClassroomService } from './reserve-classroom.service';

describe('ReserveClassroomService', () => {
  let service: ReserveClassroomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReserveClassroomService],
    }).compile();

    service = module.get<ReserveClassroomService>(ReserveClassroomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
