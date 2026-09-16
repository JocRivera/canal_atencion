import { Test, TestingModule } from '@nestjs/testing';
import { PlanServicioService } from './plan-servicio.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('PlanServicioService', () => {
  let service: PlanServicioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanServicioService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<PlanServicioService>(PlanServicioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
