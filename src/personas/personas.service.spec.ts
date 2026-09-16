import { Test, TestingModule } from '@nestjs/testing';
import { PersonasService } from './personas.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('PersonasService', () => {
  let service: PersonasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonasService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<PersonasService>(PersonasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
