import { Test, TestingModule } from '@nestjs/testing';
import { WorkexperienceController } from './workexperience.controller';
import { WorkexperienceService } from './workexperience.service';

describe('WorkexperienceController', () => {
  let controller: WorkexperienceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkexperienceController],
      providers: [WorkexperienceService],
    }).compile();

    controller = module.get<WorkexperienceController>(WorkexperienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
