import { Test, TestingModule } from '@nestjs/testing';
import { WorkexperienceService } from './workexperience.service';

describe('WorkexperienceService', () => {
  let service: WorkexperienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkexperienceService],
    }).compile();

    service = module.get<WorkexperienceService>(WorkexperienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
