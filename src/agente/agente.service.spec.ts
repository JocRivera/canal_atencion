import { Test, TestingModule } from '@nestjs/testing';
import { AgenteService } from './agente.service.js';
import { OllamaService } from './ollama.service.js';
import { ConsultarPlanesSkill } from '../skills/plan/consultar-planes.skill.js';

describe('AgenteService', () => {
  let service: AgenteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgenteService,
        { provide: OllamaService, useValue: {} },
        { provide: ConsultarPlanesSkill, useValue: {} },
      ],
    }).compile();

    service = module.get<AgenteService>(AgenteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
