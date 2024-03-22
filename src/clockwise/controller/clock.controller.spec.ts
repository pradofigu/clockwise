import { Test, TestingModule } from '@nestjs/testing';
import { ClockController } from './clockController';
import { ClockService } from '../usecase/clockService';

describe('ClockController', () => {
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
