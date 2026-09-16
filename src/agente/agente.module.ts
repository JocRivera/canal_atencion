import { Module } from '@nestjs/common';

import { AgenteController } from './agente.controller.js';
import { AgenteService } from './agente.service.js';
import { OllamaService } from './ollama.service.js';
import { ConsultarPlanesSkill } from '../skills/plan/consultar-planes.skill.js';

import { PlanModule } from '../plan/plan.module.js';

@Module({
  imports: [
    PlanModule,
  ],
  controllers: [
    AgenteController,
  ],
  providers: [
    AgenteService,
    OllamaService,
    ConsultarPlanesSkill,
  ],
  exports: [AgenteService],
})
export class AgenteModule {}