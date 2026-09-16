import { Test, TestingModule } from '@nestjs/testing';
import { ReservaServicioController } from './reserva-servicio.controller.js';

describe('ReservaServicioController', () => {
  let controller: ReservaServicioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservaServicioController],
    }).compile();

    controller = module.get<ReservaServicioController>(ReservaServicioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
