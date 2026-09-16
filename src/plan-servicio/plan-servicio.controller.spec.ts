import { Test, TestingModule } from '@nestjs/testing';
import { PlanServicioController } from './plan-servicio.controller.js';
import { PlanServicioService } from './plan-servicio.service.js';

describe('PlanServicioController', () => {
  let controller: PlanServicioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanServicioController],
      providers: [{ provide: PlanServicioService, useValue: {} }],
    }).compile();

    controller = module.get<PlanServicioController>(PlanServicioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
