import { Test, TestingModule } from '@nestjs/testing';
import { OffdaysController } from './offdays.controller';

describe('OffDaysController', () => {
  let controller: OffdaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OffdaysController],
    }).compile();

    controller = module.get<OffdaysController>(OffdaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
