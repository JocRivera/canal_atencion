import { Test, TestingModule } from '@nestjs/testing';
import { AcompanantesController } from './acompañantes.controller.js';

describe('AcompanantesController', () => {
  let controller: AcompanantesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcompanantesController],
    }).compile();

    controller = module.get<AcompanantesController>(AcompanantesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
