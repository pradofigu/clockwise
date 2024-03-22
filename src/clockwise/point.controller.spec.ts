import { Test, TestingModule } from '@nestjs/testing';
import { ClockController } from './clockController';
import { ClockService } from './clockService';

describe('PointController', () => {
  let controller: ClockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClockController],
      providers: [ClockService],
    }).compile();

    controller = module.get<ClockController>(ClockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
