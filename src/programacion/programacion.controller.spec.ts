import { Test, TestingModule } from '@nestjs/testing';
import { ProgramacionController } from './programacion.controller.js';
import { ProgramacionService } from './programacion.service.js';

describe('ProgramacionController', () => {
  let controller: ProgramacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProgramacionController],
      providers: [{ provide: ProgramacionService, useValue: {} }],
    }).compile();

    controller = module.get<ProgramacionController>(ProgramacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
