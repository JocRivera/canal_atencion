import { Injectable } from '@nestjs/common';
import { PlanService } from '../../plan/plan.service.js';

@Injectable()
export class ConsultarPlanesSkill {
  constructor(
    private readonly planesService: PlanService,
  ) {}

  async ejecutar() {
    return await this.planesService.obtenerTodos();
  }
}