import { Test, TestingModule } from '@nestjs/testing';
import { ReservaServicioService } from './reserva-servicio.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ReservaServicioService', () => {
  let service: ReservaServicioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservaServicioService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ReservaServicioService>(ReservaServicioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
