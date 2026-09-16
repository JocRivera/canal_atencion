import { Test, TestingModule } from '@nestjs/testing';
import { AlojamientoController } from './alojamiento.controller.js';
import { AlojamientoService } from './alojamiento.service.js';

describe('AlojamientoController', () => {
  let controller: AlojamientoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlojamientoController],
      providers: [{ provide: AlojamientoService, useValue: {} }],
    }).compile();

    controller = module.get<AlojamientoController>(AlojamientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
