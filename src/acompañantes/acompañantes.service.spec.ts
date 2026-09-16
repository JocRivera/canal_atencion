import { Test, TestingModule } from '@nestjs/testing';
import { AcompanantesService } from './acompañantes.service.js';

describe('AcompanantesService', () => {
  let service: AcompanantesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcompanantesService],
    }).compile();

    service = module.get<AcompanantesService>(AcompanantesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
