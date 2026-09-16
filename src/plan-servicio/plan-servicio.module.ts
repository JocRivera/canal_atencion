import { Module } from '@nestjs/common';
import { PlanServicioController } from './plan-servicio.controller.js';
import { PlanServicioService } from './plan-servicio.service.js';

@Module({
  controllers: [PlanServicioController],
  providers: [PlanServicioService]
})
export class PlanServicioModule {}
