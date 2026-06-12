import { Test, TestingModule } from '@nestjs/testing';
import { OffdaysService } from './offdays.service';

describe('OffdaysService', () => {
  let service: OffdaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OffdaysService],
    }).compile();

    service = module.get<OffdaysService>(OffdaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
