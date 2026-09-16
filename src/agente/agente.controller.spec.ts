import { Test, TestingModule } from '@nestjs/testing';
import { AgenteController } from './agente.controller.js';

describe('AgenteController', () => {
  let controller: AgenteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgenteController],
    }).compile();

    controller = module.get<AgenteController>(AgenteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
