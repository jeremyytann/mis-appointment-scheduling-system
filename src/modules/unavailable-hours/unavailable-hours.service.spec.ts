import { Test, TestingModule } from '@nestjs/testing';
import { UnavailableHoursService } from './unavailable-hours.service';

describe('UnavailableHoursService', () => {
  let service: UnavailableHoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnavailableHoursService],
    }).compile();

    service = module.get<UnavailableHoursService>(UnavailableHoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
