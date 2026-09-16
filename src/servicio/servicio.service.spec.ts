import { Test, TestingModule } from '@nestjs/testing';
import { ServicioService } from './servicio.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ServicioService', () => {
  let service: ServicioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicioService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ServicioService>(ServicioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
