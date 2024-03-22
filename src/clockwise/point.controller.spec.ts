import { Test, TestingModule } from '@nestjs/testing';
import { PointController } from './point.controller';
import { ClockService } from './clockService';

describe('PointController', () => {
  let controller: PointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PointController],
      providers: [ClockService],
    }).compile();

    controller = module.get<PointController>(PointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
