import { Test, TestingModule } from '@nestjs/testing';
import { UnavailableHoursController } from './unavailable-hours.controller';
import { UnavailableHoursService } from './unavailable-hours.service';

describe('UnavailableHoursController', () => {
  let controller: UnavailableHoursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnavailableHoursController],
      providers: [UnavailableHoursService],
    }).compile();

    controller = module.get<UnavailableHoursController>(UnavailableHoursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
