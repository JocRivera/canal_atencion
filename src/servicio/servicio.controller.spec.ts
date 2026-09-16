import { Test, TestingModule } from '@nestjs/testing';
import { ServicioController } from './servicio.controller.js';
import { ServicioService } from './servicio.service.js';

describe('ServicioController', () => {
  let controller: ServicioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicioController],
      providers: [{ provide: ServicioService, useValue: {} }],
    }).compile();

    controller = module.get<ServicioController>(ServicioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
