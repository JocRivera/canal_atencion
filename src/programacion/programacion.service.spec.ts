import { Test, TestingModule } from '@nestjs/testing';
import { ProgramacionService } from './programacion.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('ProgramacionService', () => {
  let service: ProgramacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramacionService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ProgramacionService>(ProgramacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
