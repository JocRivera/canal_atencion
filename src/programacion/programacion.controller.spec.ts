import { Test, TestingModule } from '@nestjs/testing';
import { ProgramacionController } from './programacion.controller.js';

describe('ProgramacionController', () => {
  let controller: ProgramacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramacionController],
    }).compile();

    controller = module.get<ProgramacionController>(ProgramacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
