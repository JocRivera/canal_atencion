import { Test, TestingModule } from '@nestjs/testing';
import { AgenteService } from './agente.service.js';

describe('AgenteService', () => {
  let service: AgenteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgenteService],
    }).compile();

    service = module.get<AgenteService>(AgenteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
