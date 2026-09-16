import { Test, TestingModule } from '@nestjs/testing';
import { AlojamientoService } from './alojamiento.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AlojamientoService', () => {
  let service: AlojamientoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlojamientoService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<AlojamientoService>(AlojamientoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
