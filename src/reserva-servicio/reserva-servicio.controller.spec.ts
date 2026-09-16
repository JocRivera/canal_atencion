import { Test, TestingModule } from '@nestjs/testing';
import { ReservaServicioController } from './reserva-servicio.controller.js';
import { ReservaServicioService } from './reserva-servicio.service.js';

describe('ReservaServicioController', () => {
  let controller: ReservaServicioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservaServicioController],
      providers: [
        {
          provide: ReservaServicioService,
          useValue: {
            obtenerServiciosDeReserva: vi.fn(),
            agregarServicioAReserva: vi.fn(),
            actualizarCantidadDeServicioEnReserva: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservaServicioController>(ReservaServicioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
