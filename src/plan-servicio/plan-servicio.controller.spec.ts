import { Test, TestingModule } from '@nestjs/testing';
import { PlanServicioController } from './plan-servicio.controller.js';

describe('PlanServicioController', () => {
  let controller: PlanServicioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanServicioController],
    }).compile();

    controller = module.get<PlanServicioController>(PlanServicioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
