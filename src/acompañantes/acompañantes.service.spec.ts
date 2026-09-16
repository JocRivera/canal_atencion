import { Test, TestingModule } from '@nestjs/testing';
import { AcompanantesService } from './acompañantes.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('AcompanantesService', () => {
  let service: AcompanantesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcompanantesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<AcompanantesService>(AcompanantesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
