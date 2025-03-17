import { Test, TestingModule } from '@nestjs/testing';
import { ReserveClassroomController } from './reserve-classroom.controller';
import { ReserveClassroomService } from './reserve-classroom.service';

describe('ReserveClassroomController', () => {
  let controller: ReserveClassroomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReserveClassroomController],
      providers: [ReserveClassroomService],
    }).compile();

    controller = module.get<ReserveClassroomController>(ReserveClassroomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
